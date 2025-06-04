

🚀 SniperThink Backend</h1>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-E10000?style=flat&logo=json-web-tokens&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-F7630C?style=flat&logo=gmail&logoColor=white)

Backend API for authentication and business workflows using **Node.js**, **Express**, **PostgreSQL**, **JWT**, and **Google OAuth**.

---

## ✨ Features

- ✅ User signup, login, logout with JWT authentication  
- ✅ Google OAuth login integration  
- ✅ Email sending with Nodemailer  
- ✅ PostgreSQL database connection  
- ✅ Secure password hashing using bcrypt  
- ✅ Cross-Origin Resource Sharing (CORS) support  
- ✅ Cookie parsing and management  
- ✅ Cron jobs with node-cron (optional)  

---

## ⚙️ Prerequisites

Make sure you have:

- Node.js (v16 or above recommended)  
- npm  
- PostgreSQL database server  
- Google Cloud Console project with OAuth 2.0 credentials  

---

## 🚀 Environment Setup

```bash
git clone https://github.com/SniperThink/Business_Auth_flow_bakcend.git
cd Business_Auth_flow_bakcend
````

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_key
```

Setup PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE yourdbname;
\q
```

---

## 🛠 Installation

```bash
npm install
```

---

## ▶️ Running the Server

```bash
node app.js
# or for dev with auto reload
npx nodemon app.js
```

---

## 🧭 API Overview

| Endpoint                    | Description                    |
| --------------------------- | ------------------------------ |
| `POST /signup`              | Register a new user            |
| `POST /login`               | User login                     |
| `POST /logout`              | User logout                    |
| `GET /auth/google`          | Start Google OAuth login       |
| `GET /auth/google/callback` | Google OAuth callback endpoint |

---

## 🔑 Environment Variables

| Variable               | Description                        |
| ---------------------- | ---------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string       |
| `EMAIL_USER`           | Email address for sending mail     |
| `EMAIL_PASS`           | Password or app password for email |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret         |
| `JWT_SECRET`           | Secret key to sign JWT tokens      |

---

## 📦 Dependencies

* express
* pg
* bcrypt
* jsonwebtoken
* cookie-parser & cookie
* cors
* dotenv
* nodemailer
* google-auth-library
* node-cron

---

## 🧪 Scripts

```bash
npm test
```

---

## ❓ Troubleshooting

* PostgreSQL connection errors — verify credentials and server status
* Email sending issues — check username/password & app passwords
* Google OAuth problems — verify client ID, secret, redirect URIs
* JWT errors — check your JWT secret consistency
* CORS errors — verify middleware configuration

---



## 📝 Notes

* Keep `.env` private and never commit
* Update dependencies regularly
* Extend API endpoints as needed

---

Thank you for using **SniperThink Backend!** 🎉
