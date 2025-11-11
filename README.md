# MERN Stack Portfolio Application

A full-featured portfolio website built with the MERN stack (MongoDB, Express, React, Node.js) featuring a public-facing portfolio and an admin panel for content management.

## Features

### Public Pages
- **Home**: Hero section with navigation
- **About**: Personal information and skills display with proficiency bars
- **Projects**: Project showcase with filtering by category and technology
- **Blog**: Blog posts listing with individual post pages
- **Contact**: Contact form for visitors
- **Resume/Experience**: Timeline view of work experience and education

### Admin Panel
- **Dashboard**: Overview with statistics
- **Projects Management**: Add, edit, delete projects with image upload
- **Blog Management**: Create, edit, delete blog posts with image upload
- **Skills Management**: Manage skills with categories and proficiency levels
- **Experience Management**: Manage work experience, education, internships
- **Contact Management**: View and manage contact form submissions

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

### Frontend
- React
- React Router
- Axios for API calls
- CSS for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Portfolio
```

2. Install root dependencies:
```bash
npm install
```

3. Install server dependencies:
```bash
cd server
npm install
```

4. Install client dependencies:
```bash
cd ../client
npm install
```

5. Create environment file:
```bash
cd ../server
cp .env.example .env
```

6. Update `server/.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
```

7. Start MongoDB (if running locally)

8. Run the application:

   **Option 1: Run separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

   **Option 2: Run concurrently (from root)**
   ```bash
   npm run dev
   ```

## Usage

### First Time Setup

1. Start the application
2. Navigate to `/admin/login`
3. Register the first admin account (registration is only available when no users exist)
4. Login with your credentials
5. Start adding content through the admin panel

### Admin Routes
- `/admin` - Dashboard
- `/admin/login` - Login page
- `/admin/projects` - Manage projects
- `/admin/blog` - Manage blog posts
- `/admin/skills` - Manage skills
- `/admin/experience` - Manage experience
- `/admin/contact` - View contact messages

### Public Routes
- `/` - Home
- `/about` - About page
- `/projects` - Projects showcase
- `/blog` - Blog listing
- `/blog/:id` - Individual blog post
- `/contact` - Contact form
- `/resume` - Resume/Experience timeline

## Project Structure

```
Portfolio/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── BlogPost.js
│   │   ├── Contact.js
│   │   ├── Skill.js
│   │   └── Experience.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── blog.js
│   │   ├── contact.js
│   │   ├── skills.js
│   │   └── experience.js
│   ├── uploads/
│   ├── index.js
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (first user only)
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Projects
- `GET /api/projects` - Get all projects (with optional filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Blog
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/admin/all` - Get all posts (admin only)
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (admin only)
- `PUT /api/blog/:id` - Update post (admin only)
- `DELETE /api/blog/:id` - Delete post (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/:id` - Get single message (admin only)
- `PATCH /api/contact/:id` - Update message (admin only)
- `DELETE /api/contact/:id` - Delete message (admin only)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Experience
- `GET /api/experience` - Get all experience items
- `GET /api/experience/:id` - Get single experience
- `POST /api/experience` - Create experience (admin only)
- `PUT /api/experience/:id` - Update experience (admin only)
- `DELETE /api/experience/:id` - Delete experience (admin only)

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting for production
- Add input validation and sanitization
- Use HTTPS in production
- Regularly update dependencies

## License

ISC

