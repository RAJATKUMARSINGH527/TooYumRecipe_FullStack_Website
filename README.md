# ✨ TooYumRecipe_FullStack_Website

## 🌟 Project Overview  
The **TooYum Recipe FullStack Website** allows users to **discover, save, and interact with recipes**. Users can **search for recipes, like their favorites, and view saved recipes**. The application provides a seamless user experience with authentication and dynamic UI updates.

Built with **React (frontend), Node.js/Express (backend), and MongoDB (database)**, this project demonstrates full-stack development.  

🔗 **Live Demo:**  *([Click here to view the deployed application ](https://too-yum-recipe-full-stack-website.vercel.app/))*  

---

## ✨ Key Features & Technologies  


### 🌟 Features  
✅ Search for seafood recipes using a external TheMealDB API *(https://spoonacular.com/food-api)*

✅ Like and save favorite recipes to user profile

✅ Responsive UI for all devices

✅ Backend for user authentication and recipe management

✅ User Authentication (Signup/Login with JWT)  

✅ Secure API with JWT-based authentication  

### 🛠️ Tech Stack  
#### **Frontend (React + Vite)**
- React.js (UI framework)
- React Router (Navigation)
- CSS Modules (Styling)
- Lucide-react for icons

#### **Backend (Node.js + Express)**
- Node.js (Server-side runtime)
- Express.js (API framework)
- MongoDB + Mongoose (Database)
- CORS and dotenv
- JWT (Authentication)
- Bcrypt (Password encryption)

#### **Deployment**
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  

---

## ⚙️ Setup Instructions  

### 🔹 1. Clone the Repository  
```bash
git clone https://github.com/RAJATKUMARSINGH527/TooYumRecipe_FullStack_Website.git

cd TooYumRecipe_FullStack_Website
```

🔹 **2. Setup Backend**

1️⃣ Navigate to the backend folder:
```bash
cd backend
```

2️⃣ Install dependencies:
```bash
npm install
```

3️⃣ **Create a `.env` file and add your MongoDB URI & JWT Secret:**
```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
SALT_ROUNDS= your salt rounds
PORT=your port
SPOONACULAR_API_KEY= your SPOONACULAR_API_KEY
```

4️⃣ **Start the backend server:**
```bash
npm run server
```
Backend runs on http://localhost:5000

🔹 **3. Setup Frontend**

1️⃣ Navigate to the frontend folder:
```bash
cd ../Frontend
```

2️⃣ Install dependencies:
```bash
npm install
```

3️⃣ Start the frontend:
```bash
npm run dev
```
Frontend runs on http://localhost:5173

---

## 🛠️ API Endpoints  

### 🔹 Authentication Routes
| Method | Endpoint | Description | Request Body |
|--------|---------|-------------|--------------|
| POST | `/auth/register` | Register a new user | `{ "name": "John", "email": "john@example.com", "password": "123456" }` |
| POST | `/auth/login` | User login | `{ "email": "john@example.com", "password": "123456" }` |

### 🔹 Recipe Routes
| Method | Endpoint | Description | Request Body |
|--------|---------|-------------|--------------|
| GET | `/recipes/search` | Fetch all recipes | N/A |
| GET | `/recipes/search/:id` | Fetch a specific recipe | N/A |
| POST | `/addfavorites` | Add recipe to favorites | `{ "recipeId": "12345" }` |
| GET | `/favorites` | Get all favorite recipes | N/A |
| DELETE | `favorites/:id` | Remove recipe from favorites | N/A |

### 🔹 User Routes
| Method | Endpoint | Description | Request Body |
|--------|---------|-------------|--------------|
| GET | `/auth/user/:id` | Get user profile by ID | N/A |
| GET | `/auth/users/` | Get profile of all users | N/A |

---

## 🌐 Deployment Links

Frontend (Vercel): **Live App** *([Frontend Deployed Link Here](https://too-yum-recipe-full-stack-website.vercel.app/))*  
Backend (Render): **Live API** *([Backend Deployed Link Here](https://tooyumrecipe-fullstack-website.onrender.com))*  

---

## License
This project is open-source and available under the MIT License.

