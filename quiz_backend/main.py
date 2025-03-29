import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64

load_dotenv()

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = [
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/gmail.send'
]

# Pydantic Models
class Question(BaseModel):
    question: str
    options: List[str]

class Quiz(BaseModel):
    title: str
    questions: List[Question]

class QuizApproval(BaseModel):
    approved: bool
    email: str

# In-Memory Database
quizzes = {}

# Utility to get Google credentials
def get_google_credentials():
    try:
        flow = InstalledAppFlow.from_client_secrets_file(
            os.getenv('GOOGLE_CLIENT_SECRET_PATH'), SCOPES)
        creds = flow.run_local_server(port=0)
        return creds
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting credentials: {str(e)}")

# Create Google Form-based Quiz
def create_google_form(creds, title, questions):
    try:
        service = build('forms', 'v1', credentials=creds)

        # Create an empty form
        form_body = {
            'info': {'title': title}
        }
        form = service.forms().create(body=form_body).execute()
        form_id = form['formId']

        # Prepare the batch update for questions
        requests = []
        for item in questions:
            request = {
                'createItem': {
                    'item': {
                        'title': item.question,
                        'questionItem': {
                            'question': {
                                'required': True,
                                'choiceQuestion': {
                                    'type': 'RADIO',
                                    'options': [{'value': option} for option in item.options]
                                }
                            }
                        }
                    },
                    'location': {'index': 0}
                }
            }
            requests.append(request)

        # Batch update request
        batch_update_body = {'requests': requests}
        service.forms().batchUpdate(formId=form_id, body=batch_update_body).execute()

        # Retrieve form URL
        form = service.forms().get(formId=form_id).execute()
        form_url = form.get('responderUri', '')

        return form_id, form_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating Google Form: {str(e)}")

# Send Email Notification
def send_email(creds, recipient, subject, message_text):
    try:
        service = build('gmail', 'v1', credentials=creds)
        message = MIMEText(message_text)
        message['to'] = recipient
        message['subject'] = subject
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        send_message = {'raw': encoded_message}
        service.users().messages().send(userId='me', body=send_message).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

# API Endpoints

@app.post("/quizzes/")
def create_quiz(quiz: Quiz):
    creds = get_google_credentials()
    form_id, form_url = create_google_form(creds, quiz.title, quiz.questions)
    quiz_id = len(quizzes) + 1
    quizzes[quiz_id] = {
        'title': quiz.title,
        'status': 'draft',
        'form_id': form_id,
        'form_url': form_url,
        'questions': quiz.questions
    }
    return {"quiz_id": quiz_id, "status": "draft", "form_url": form_url}


@app.post("/quizzes/{quiz_id}/approve")
def approve_quiz(quiz_id: int, approval: QuizApproval):
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")

    if quizzes[quiz_id]['status'] != 'draft':
        raise HTTPException(status_code=400, detail="Invalid quiz status transition")

    creds = get_google_credentials()
    quizzes[quiz_id]['status'] = 'approved'
    email_subject = "Quiz Approval Notification"
    email_body = f"""
    Dear Quiz Administrator,

    We are pleased to inform you that your quiz titled "{quizzes[quiz_id]['title']}" has been successfully approved and is now available for participants.

    You can access the quiz using the following link:
    {quizzes[quiz_id]['form_url']}

    If you have any questions or require further assistance, please feel free to reach out to our support team.

    Best regards,
    Quiz Management Team
    """
    send_email(creds, approval.email, email_subject, email_body)
    return {"message": "Quiz approved and email sent"}

@app.get("/quizzes/")
def list_quizzes():
    return {"quizzes": [{"quiz_id": qid, "title": q['title'], "status": q['status'], "form_url": q['form_url']} for qid, q in quizzes.items()]}

@app.get("/quizzes/{quiz_id}")
def get_quiz(quiz_id: int):
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quizzes[quiz_id]

@app.delete("/quizzes/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(quiz_id: int):
    if quiz_id not in quizzes:
        raise HTTPException(status_code=404, detail="Quiz not found")
    del quizzes[quiz_id]
    return {"message": "Quiz deleted successfully"}
