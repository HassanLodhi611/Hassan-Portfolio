# Hassan Lodhi — Portfolio (MERN Stack)

> Production-ready full-stack portfolio. React + Vite frontend, Node.js + Express backend, MongoDB database, Cloudinary image uploads, JWT authentication.

---

## 📁 Project Structure

```
hassan-portfolio/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Multer-Cloudinary storage config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── certificateController.js
│   │   ├── skillController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── auth.js                # JWT protect middleware
│   ├── models/
│   │   ├── Project.js
│   │   ├── Certificate.js
│   │   ├── Skill.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── certificates.js
│   │   ├── skills.js
│   │   └── contact.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── styles/
    │   │   └── global.css
    │   ├── services/
    │   │   └── api.js             # Axios instance + all API calls
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── hooks/
    │   │   ├── useReveal.js       # Scroll-reveal IntersectionObserver
    │   │   └── useFetch.js        # Generic data fetching
    │   ├── pages/
    │   │   ├── PortfolioPage.jsx
    │   │   ├── LoginPage.jsx + .module.css
    │   │   └── AdminPage.jsx + .module.css
    │   ├── components/
    │   │   ├── Navbar/
    │   │   ├── Hero/              # Canvas particle animation
    │   │   ├── About/
    │   │   ├── Skills/            # Fetches from API, animated bars
    │   │   ├── Projects/          # Filter + Cloudinary images
    │   │   ├── Certificates/      # Fetches from API
    │   │   ├── Contact/           # Sends to backend API
    │   │   ├── Footer/
    │   │   ├── shared/
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── Modal.jsx + .module.css
    │   │   │   └── ImageUpload.jsx + .module.css
    │   │   └── admin/
    │   │       ├── AdminSidebar.jsx + .module.css
    │   │       ├── AdminTopbar.jsx + .module.css
    │   │       └── panels/
    │   │           ├── OverviewPanel.jsx + .module.css
    │   │           ├── ProjectsPanel.jsx + .module.css
    │   │           ├── CertificatesPanel.jsx + .module.css
    │   │           ├── SkillsPanel.jsx + .module.css
    │   │           └── AboutPanel.jsx + .module.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env        # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env        # set VITE_API_URL
```

### 2. Set up MongoDB Atlas

1. Go to https://cloud.mongodb.com — create a free cluster
2. Create a database user
3. Whitelist your IP (or 0.0.0.0/0 for dev)
4. Copy the connection string into `backend/.env` → `MONGODB_URI`

### 3. Set up Cloudinary

1. Go to https://cloudinary.com — free account
2. Copy Cloud Name, API Key, API Secret into `backend/.env`

### 4. Configure `.env` files

**backend/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hassan-portfolio
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed Skills (first run)

After starting the backend, run this in your browser console or via Postman to create default skill categories:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
# Copy the token, then:

curl -X POST http://localhost:5000/api/skills \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"Frontend Development","icon":"⚛","accentColor":"mint","tags":["React","JavaScript","HTML5","CSS3","Tailwind","Redux"],"bars":[{"label":"React","width":75},{"label":"JS","width":80},{"label":"CSS","width":85}],"order":1}'
```

### 6. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

---

## 🌐 Routes

| URL               | Page                  |
|-------------------|-----------------------|
| `/`               | Portfolio (public)    |
| `/admin/login`    | Admin login           |
| `/admin`          | Admin dashboard       |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint          | Auth     | Description        |
|--------|-------------------|----------|--------------------|
| POST   | `/api/auth/login` | —        | Admin login → JWT  |
| GET    | `/api/auth/verify`| Bearer   | Verify token       |

### Projects
| Method | Endpoint             | Auth    | Description          |
|--------|----------------------|---------|----------------------|
| GET    | `/api/projects`      | —       | List all (+ ?category)|
| GET    | `/api/projects/:id`  | —       | Get one              |
| POST   | `/api/projects`      | Bearer  | Create + image upload|
| PUT    | `/api/projects/:id`  | Bearer  | Update + image       |
| DELETE | `/api/projects/:id`  | Bearer  | Delete + Cloudinary  |

### Certificates
| Method | Endpoint                | Auth    | Description          |
|--------|-------------------------|---------|----------------------|
| GET    | `/api/certificates`     | —       | List all             |
| POST   | `/api/certificates`     | Bearer  | Create + image upload|
| PUT    | `/api/certificates/:id` | Bearer  | Update               |
| DELETE | `/api/certificates/:id` | Bearer  | Delete               |

### Skills
| Method | Endpoint           | Auth    | Description   |
|--------|--------------------|---------|---------------|
| GET    | `/api/skills`      | —       | List all      |
| POST   | `/api/skills`      | Bearer  | Create        |
| PUT    | `/api/skills/:id`  | Bearer  | Update tags   |
| DELETE | `/api/skills/:id`  | Bearer  | Delete        |

### Contact
| Method | Endpoint              | Auth    | Description         |
|--------|-----------------------|---------|---------------------|
| POST   | `/api/contact`        | —       | Submit message      |
| GET    | `/api/contact`        | Bearer  | List messages       |
| PATCH  | `/api/contact/:id/read` | Bearer | Mark as read      |

---

## 🚢 Production Deployment

### Backend → Railway / Render

1. Push `backend/` to GitHub
2. Connect repo on https://railway.app or https://render.com
3. Set all environment variables in the dashboard
4. Set `NODE_ENV=production`

### Frontend → Vercel / Netlify

1. Push `frontend/` to GitHub
2. Connect on https://vercel.com
3. Set `VITE_API_URL=https://your-backend-url.railway.app/api`
4. Build command: `npm run build`, Output: `dist`

### Update CORS

In `backend/.env`:
```env
CLIENT_URL=https://your-frontend.vercel.app
```

---

## 🔐 Security Notes

- Change `ADMIN_PASSWORD` before deployment
- Never commit `.env` files — add to `.gitignore`
- JWT tokens expire in 7 days by default
- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js adds security headers automatically
- Cloudinary validates image MIME types server-side

---

## 🛠 Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite + React Router |
| Styling   | CSS Modules (exact original design) |
| Backend   | Node.js + Express              |
| Database  | MongoDB + Mongoose             |
| Auth      | JWT (jsonwebtoken + bcryptjs)  |
| Images    | Cloudinary + Multer            |
| Security  | Helmet + express-rate-limit    |

---

*Built with ♥ — Hassan Lodhi Portfolio*
