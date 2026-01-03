🎓 Internship Portal – MERN Stack

A full-stack Internship Portal built using the MERN stack, where students can apply for internships, upload resumes, and track applications, while companies can post internships and manage applicants.

🔗 Live Demo

Frontend (Netlify): https://gleaming-clafoutis-3a05bb.netlify.app

Backend (Render): https://internship-portal-backend-6rv5.onrender.com

🚀 Features
👨‍🎓 Student

Register & login with authentication (JWT)

Browse available internships

Search & filter internships

Apply for internships with resume upload (PDF)

View applied internships

Withdraw applications

🏢 Company

Register & login

Post new internships

View applicants for posted internships

Access student details and resumes

🔐 Authentication & Security

Role-based access (Student / Company)

Secure JWT authentication

Unique email constraint

Protected routes (frontend & backend)

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

React Router DOM

Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

Multer (Resume Upload)

Deployment

Frontend: Netlify

Backend: Render

Database: MongoDB Atlas

Version Control: Git & GitHub

📂 Project Structure
internship-portal/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── netlify.toml
│   └── vite.config.js
│
└── README.md

⚙️ Environment Variables
Backend (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend (Netlify Environment Variables)
VITE_API_URL=https://internship-portal-backend-6rv5.onrender.com

🧪 Run Locally
1️⃣ Clone the repository
git clone https://github.com/chaudharyhepin/internship-portal.git
cd internship-portal

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

📦 Build Frontend for Production
cd frontend
npm run build

🖼️ Screenshots

Student Dashboard

Internship Listings

Resume Upload

Company Applicant View

(You can add screenshots later to improve visibility)

🎯 Future Enhancements

Application status tracking (Accepted / Rejected)

Email notifications

Admin dashboard

Resume preview/download

Pagination & performance optimization

👤 Author

Hepin Chaudhary
📧 Email: chaudharyhepin2006@gmail.com

🔗 GitHub: https://github.com/chaudharyhepin

🔗 LinkedIn: https://linkedin.com/in/chaudharyhepin

⭐ If you like this project

Give it a ⭐ on GitHub — it helps a lot!
