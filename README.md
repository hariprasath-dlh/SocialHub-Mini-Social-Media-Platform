```markdown
# SocialHub – Mini Social Media Platform

SocialHub is a full-stack MERN social media application that allows users to create accounts, share text or image posts, view a public feed, and interact with posts through likes and comments. This project was developed as part of a full-stack internship assignment, following real-world development, debugging, and deployment practices.

---

## 🚀 Features

- User authentication (Sign up & Login)
- Create text and image posts
- Public feed for all users
- Like and comment on posts
- User profile with profile picture
- Real-time updates using Socket.io
- Responsive UI for desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- HTML, CSS, JavaScript
- Axios

### Backend
- Node.js
- Express.js
- Socket.io

### Database
- MongoDB Atlas

---

## 📂 Project Structure

```
SocialHub/
├── backend/        # Node.js + Express backend
├── frontend/       # React frontend (Vite)
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

> Note: Environment files are ignored using `.gitignore` and should never be pushed to GitHub.

---

## 🔄 Application Flow

1. User signs up or logs in
2. User creates a post (text or image)
3. Posts appear in the public feed
4. Other users can like and comment
5. Profile page displays user details and posts
6. Real-time updates are handled using Socket.io

---

## ▶️ Running the Project Locally

### Start Backend
```
cd backend
npm install
npm start
```

Backend runs on:
```
http://localhost:5000
```

---

### Start Frontend
```
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🎯 Project Highlights

- Clean and modular project structure
- Proper Git hygiene with `.gitignore`
- Secure environment variable handling
- MongoDB Atlas authentication
- Real-world debugging and deployment experience

---

## 📌 Future Enhancements

- Follow / unfollow users
- Notification system
- Post pagination
- UI/UX improvements
- Production redeployment

---

## 👤 Author

Hariprasath  
Aspiring Full Stack Developer  

GitHub: https://github.com/hariprasath-dlh

---

## 📄 License

This project is developed for educational and internship evaluation purposes.
```
