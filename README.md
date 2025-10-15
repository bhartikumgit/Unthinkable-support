# Unthinkable Support Bot

A modern AI-powered customer support chatbot built with React, FastAPI, and Google's Gemini AI.

## Features

- 🤖 AI-powered responses using Gemini
- 💬 Real-time chat interface
- 🎨 Modern UI with animations
- 📱 Fully responsive design
- 🖼️ Image upload support
- 🔄 Quick reply options

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Vite

- Backend:
  - Python
  - FastAPI
  - SQLAlchemy
  - Google Gemini AI

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bhartikumgit/Unthinkable-support.git
   cd Unthinkable-support
   ```

2. Setup Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Setup Frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Create environment files:

   Backend (.env):
   ```
   GEMINI_API_KEY=your_api_key_here
   DATABASE_URL=sqlite:///./support_bot.db
   ```

   Frontend (.env):
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at http://localhost:5173

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)