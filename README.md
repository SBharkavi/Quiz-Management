# 📌 Quiz Management System  

This project allows users to **create quizzes**, **generate Google Forms automatically**, **review them**, and **send email notifications** using **FastAPI** and **ReactJS**.  

---

## 🛠️ Features  

✅ **Create Quizzes** → Convert structured text into Google Forms.  
✅ **Google Forms API** → Automate quiz creation.  
✅ **Quiz Approval Workflow** → Review and approve quizzes before sharing.  
✅ **Email Notifications** → Send quiz links via email using the Gmail API.  
✅ **ReactJS Frontend** → User-friendly interface for creating, reviewing, and approving quizzes.  
---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/SBharkavi/Quiz-Management.git
cd Quiz-Management
```

---

### 2️⃣ Backend Setup (FastAPI)  

#### ✅ Create Virtual Environment & Install Dependencies  
```bash
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate (Linux/macOS)
venv\Scripts\activate  # Activate (Windows)
pip install -r requirements.txt  # Install dependencies
```

---

### 3️⃣ Configure Google Credentials  

#### ✅ Enable Google APIs  
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.  
2. Enable: **Google Forms API**, **Gmail API**, and **Google Drive API**.  
3. Create **OAuth Credentials**:  
   - Navigate to **"APIs & Services" > "Credentials"**.  
   - Create **OAuth 2.0 Client ID** for a **Desktop App**.  
   - Download `credentials.json` and place it in the `backend/` directory.  

#### ✅ Set Environment Variables  

Create a `.env` file in the `backend/` directory:  

```ini
GOOGLE_CLIENT_SECRET_PATH=backend/credentials.json
ADMIN_EMAIL=your-email@example.com
```

For Linux/macOS:  
```bash
export GOOGLE_CLIENT_SECRET_PATH=backend/credentials.json
export ADMIN_EMAIL=your-email@example.com
```

For Windows (PowerShell):  
```powershell
$env:GOOGLE_CLIENT_SECRET_PATH="backend/credentials.json"
$env:ADMIN_EMAIL="your-email@example.com"
```

---

### 4️⃣ Run the Backend  
```bash
uvicorn main:app --reload
```
API will be available at **`http://127.0.0.1:8000`**.  

---

### 5️⃣ Frontend Setup (ReactJS)  

#### ✅ Install Dependencies  
```bash
cd frontend
npm install
```

#### ✅ Run the Frontend  
```bash
npm start
```
Frontend will be available at **`http://localhost:3000`**.  

---  

## 📌 API Endpoints  

### 🎯 **Quizzes Management**  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/quizzes/` | Create a new quiz |
| `GET` | `/quizzes/` | List all quizzes |
| `GET` | `/quizzes/{quiz_id}` | Get quiz details |
| `DELETE` | `/quizzes/{quiz_id}` | Delete a quiz |

### ✅ **Approval Workflow**  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/quizzes/{quiz_id}/approve` | Approve a quiz and send email |

---

## 💡 Additional Notes  

- Ensure **Google credentials** are set correctly before running the backend.  
- The **Google Form link** is generated upon quiz creation.  
---

Now you’re all set! 🚀 🎉
