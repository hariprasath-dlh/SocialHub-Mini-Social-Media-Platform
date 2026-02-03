# SocialHub – Mini Social Media Platform

SocialHub is a full-stack MERN social media application that allows users to create accounts, share text or image posts, view a public feed, and interact with posts through likes and comments. This project is built as part of a full-stack internship assignment, following real-world development and deployment practices.

---

## 🚀 Features

- User authentication (Sign up & Login)
- Create posts with text, image, or both
- Public feed displaying all user posts
- Like and comment on posts
- Display total likes and comments count
- Stores usernames of users who liked or commented
- Responsive UI for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML, CSS, JavaScript
- UI Styling (Material UI / Bootstrap / CSS)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel / Netlify
- Backend: Render
- Database: MongoDB Atlas

```

## 📂 Project Structure

SocialHub/
│
├── frontend/ # React frontend
│
├── backend/ # Node + Express backend
│
└── README.md


```

## ⚙️ Environment Variables

The backend uses environment variables for secure configuration.

Create a `.env` file inside the `backend` folder and add:

MONGO_URI=your_mongodb_connection_string
PORT=10000
JWT_SECRET=your_secret_key


> Note: `.env` files are ignored using `.gitignore` and should never be pushed to GitHub.

---

## 🔄 Application Flow

1. User registers or logs in
2. User creates a post (text/image)
3. Posts appear in the public feed
4. Other users can like or comment
5. Likes and comments update instantly in the UI

---

## 🌐 Deployment

- Backend is deployed on **Render**
- Frontend is deployed on **Vercel / Netlify**
- MongoDB Atlas is used as a cloud database

All services are connected using environment variables for secure communication.

---

## 🎯 Project Purpose

This project demonstrates:
- Full-stack development skills
- REST API design
- Database modeling using MongoDB
- Authentication flow
- Clean folder structure
- Cloud deployment workflow

It is designed to closely resemble real-world social media feed functionality.

---

## 📌 Future Improvements

- Pagination for posts
- User profile page
- Notification system
- Image upload optimization
- Enhanced UI/UX

---

## 👤 Author

**Hariprasath**  
Aspiring Full Stack Developer  
GitHub: https://github.com/hariprasath-dlh

---

## 📄 License

This project is created for educational and internship evaluation purposes.
