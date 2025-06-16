# 🚚 AI Carrier Chatbot

This is a full-stack AI-powered web application that allows users to interact with a chatbot for carrier-related queries. The system includes user authentication, chat history, and intelligent responses powered by AI (e.g., OpenAI or Gemini).

---

## ✨ Features

* **User Authentication**: Secure login and registration system.
* **Chat Interface**: Interactive chat window for seamless communication with the AI chatbot.
* **Chat History**: Stores and displays previous conversations with the AI.
* **AI Integration**: Utilizes powerful AI models (like OpenAI or Google Gemini) to provide intelligent and relevant responses to carrier-related questions.
* **Clean UI/UX**: Intuitive and user-friendly interface with contextual routing and protected pages for a smooth experience.

---

## 🚀 Technologies Used

### Backend:

* **Node.js**: JavaScript runtime environment for the server.
* **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB**: NoSQL database for flexible data storage (users, chat history).
* **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
* **Bcrypt.js**: For secure password hashing.
* **JSON Web Tokens (JWT)**: For secure authentication.
* **Dotenv**: For managing environment variables securely.
* **Nodemon**: For automatic server restarts during development.
* **OpenAI API / Google Gemini API**: For integrating AI capabilities to generate chatbot responses.

### Frontend:

* **React**: A JavaScript library for building user interfaces.
* **HTML5**: Standard markup language for web pages.
* **CSS3**: Styling language used for the application's appearance.
* **JavaScript (ES6+)**: Core programming language for frontend logic and dynamic interactions.

---

## 📁 Project Structure

The project is organized into two main top-level folders, representing the client and server applications:

* `ai-carrier-chatbot/`
    * `client/` &mdash; React frontend application
        * `public/`
            * `index.html` &mdash; Main HTML file
        * `src/`
            * `components/` &mdash; Reusable React components (e.g., `AuthForm`, `Sidebar`, `ChatWindow`)
            * `pages/` &mdash; React page components (e.g., `Chat`, `Login`, `Signup`)
            * `App.js` &mdash; Main application entry point for React
            * `AuthContext.js` &mdash; React Context API for managing user authentication state
            * `index.js` &mdash; Frontend JavaScript entry point
        * `.env` &mdash; Frontend environment configuration
        * `package.json` &mdash; Frontend dependencies and scripts
    * `server/` &mdash; Node.js backend application
        * `config/`
            * `db.js` &mdash; MongoDB connection setup
        * `controllers/` &mdash; Business logic for authentication and chat functionalities
        * `middleware/` &mdash; Custom Express middleware (e.g., for authentication)
        * `models/` &mdash; Mongoose schemas for MongoDB collections (`User`, `Chat`)
        * `routes/` &mdash; Express routes for API endpoints (e.g., `/api/auth`, `/api/chat`)
        * `.env` &mdash; Server environment configuration
        * `server.js` &mdash; Entry point for the backend server

---

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (includes npm).
* **MongoDB**:
    * **Local Installation**: [Download & Install MongoDB Community Server](https://www.mongodb.com/try/download/community)
    * **Cloud (Recommended)**: Set up a free tier account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* **Git**: [Download & Install Git](https://git-scm.com/downloads).
* **OpenAI API Key or Google Gemini API Key**: Obtain one from your chosen AI provider if you plan to use AI features.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Ibrahimsyed70737/ai-carrier-chatbot.git](https://github.com/Ibrahimsyed70737/ai-carrier-chatbot.git)
    cd ai-carrier-chatbot
    ```

2.  **Install Frontend Dependencies:**
    Navigate into the `client` directory and install the required npm packages:

    ```bash
    cd client
    npm install
    ```

3.  **Install Backend Dependencies:**
    Navigate back to the root directory, then into the `server` directory, and install the required npm packages:

    ```bash
    cd ../server
    npm install
    ```

4.  **Set up Environment Variables:**

    * **For the Frontend:**
        Create a file named `.env` in the `client/` directory (`ai-carrier-chatbot/client/.env`).
        Add the following content:

        ```env
        REACT_APP_GEMINI_API_KEY="YOUR API KEY"
        REACT_APP_API_URL=http://localhost:5000
        ```

    * **For the Backend:**
        Create a file named `.env` in the `server/` directory (`ai-carrier-chatbot/server/.env`).
        Add the following content to it:

        ```env
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=a_strong_secret_key_for_jwt_signing
        OPENAI_API_KEY=your_openai_api_key_here (if using OpenAI)
        GEMINI_API_KEY=your_gemini_api_key_here (if using Gemini)
        PORT=5000
        ```
        * **`MONGODB_URI`**:
            * **For MongoDB Atlas**: Go to your Atlas cluster, click "Connect", choose "Connect your application", and copy the connection string. Replace `<username>`, `<password>`, and `<dbname>` with your actual database user credentials and desired database name (e.g., `ai_carrier_chatbot_db`).
            * **For Local MongoDB**: Typically `mongodb://localhost:27017/ai_carrier_chatbot_db`.
        * **`JWT_SECRET`**: Generate a long, random string. You can use an online tool or generate one with Node.js: `require('crypto').randomBytes(64).toString('hex')`.
        * **`OPENAI_API_KEY` / `GEMINI_API_KEY`**: Replace with your actual API key if you are integrating with OpenAI or Google Gemini. Choose only one depending on which AI you use.

---

## 💻 Running the Application

You will need two separate terminal windows for this: one for the backend server and one for the frontend development server.

### 1. Start the Backend Server:

Open your first terminal, navigate to the `server/` directory, and run:

```bash
cd server
node server.js
```
You should see messages indicating the server is running (e.g., "Server running on port 5000" and "MongoDB Connected").

2. Start the Frontend (Development Server):
Open your second terminal, navigate to the client/ directory, and run:

```bash

cd client
npm start
```
This will open the application in your default web browser (usually at http://localhost:3000, which will then proxy API requests to http://localhost:5000). If it doesn't open automatically, navigate to http://localhost:3000 in your browser.

### 🧪 API Routes Overview
The backend exposes the following API endpoints:

POST /api/auth/register – User registration (create a new account)
POST /api/auth/login – User login (authenticate and receive a JWT)
GET /api/chat/history – Get the current user's previous chat history
POST /api/chat – Send a user message to the chatbot and receive an AI-generated response
###📷 UI Preview
(Add screenshots or a link to a live demo of your application here if available)

### 🤝 Contributing
Contributions are welcome! Feel free to fork the repository, open issues for bugs or feature requests, or submit pull requests.

### 📄 License
This project is licensed under the MIT License.
