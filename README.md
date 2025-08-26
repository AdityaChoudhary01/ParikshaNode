# ParikshaNode 🚀

**ParikshaNode** is a modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** quiz application.  
It’s designed to be a feature-rich platform where users can **take quizzes** and also **create & share** their own.  

This project was developed as a **final-year project** by **Computer Science students at GNIOT, Ghaziabad (2022-2026 Batch).**

---

## 🌍 Live Demo  
[parikshanode](https://parikshanode.netlify.app/)

---

## ✨ Features  

ParikshaNode is packed with features for both **users** and **admins**:

- 👨‍👩‍👧 **User Authentication** – Secure **JWT-based login & registration**  
- 🎨 **Role-Based Access** – Users (take/create quizzes) & Admins (manage users/quizzes)  
- 📝 **User-Generated Quizzes** – Create, manage & share quizzes with unique links  
- ⏲️ **Dual Timer System** – Overall quiz timer or per-question timer option  
- 👤 **Profile Management** – Update username & upload profile picture via **Cloudinary**  
- 🏆 **Leaderboards & History** – View top scores & track quiz-taking history  
- 🌗 **Light & Dark Mode** – Modern UI with theme toggle  
- 📱 **Fully Responsive** – Optimized across mobile, tablet & desktop  
- 📧 **Contact Form** – Powered by **Nodemailer** to email the admin  
- ❤️ **PWA Enabled** – Installable like a native app on home screen  
- 🔍 **SEO Optimized** – Dynamic meta tags + sitemap + robots.txt  

---

## 🛠️ Tech Stack  

- **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT + bcrypt.js  
- **File Uploads:** Cloudinary + Multer  
- **Email:** Nodemailer  

---

## 🚀 Getting Started  

Follow these steps to set up the project locally.

### ✅ Prerequisites  
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)  
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally **or MongoDB Atlas** account  

---

### 🔧 Installation & Setup  

#### 1. Clone the repository

```

git clone https://github.com/your-username/ParikshaNode.git
cd ParikshaNode

```

#### 2. Setup the Backend

```

cd server
npm install

```

📄 Create a `.env` file inside `/server` with the following:


PORT=5001

# MongoDB

MONGO_URI=your_mongodb_connection_string

# JWT

JWT_SECRET=your_super_secret_jwt_key

# Cloudinary

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer (use a Gmail App Password)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your-email@gmail.com


#### 3. Setup the Frontend

```
cd ../client
npm install

```

---

### ▶️ Running the Application  

Open **two terminals**:

#### Start Backend (Server):
```

cd server
npm run dev

```
➡️ Runs on: `http://localhost:5001`

#### Start Frontend (Client):
```

cd client
npm run dev

```
➡️ Runs on: `http://localhost:5173`

---

## 👥 Authors  

This project was proudly developed by **B.Tech CSE Final Year Students (GNIOT 2022–2026 Batch):**

- **Aditya Choudhary** – Project Lead & Full-Stack Developer  
- **Suraj Mishra** – Backend Developer  
- **Amrita Yadav** – Frontend Developer  
- **Sachin Maurya** – UI/UX Designer  

---

## 📜 License  

This project is licensed under the **MIT License**.  
Feel free to use and modify it for your own learning & projects.  
