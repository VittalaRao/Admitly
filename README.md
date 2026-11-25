Admitly/
|- backend/
|  |- main.py
|  |- requirements.txt
|  `- .env.example
|- frontend/
|  |- src/
|  |- package.json
|  `- .env.example
|- screenshots/
`- vercel.toml
```

## Run locally

### Prerequisites

- Node.js 18 or later
- Python 3.12 or later
- A MongoDB Atlas cluster

### 1. Clone the repository

```bash
git clone https://github.com/VittalaRao/Admitly.git
cd Admitly
```

### 2. Configure the backend

Create `backend/.env` and add your MongoDB Atlas connection string:

```env
MONGO_URL=your_mongodb_atlas_connection_string
CORS_ORIGINS=http://localhost:5173
```

Install the Python dependencies and start FastAPI:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 3001
```

The backend runs at `http://localhost:3001`.

### 3. Configure and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create a patient |
| PUT | `/api/patients/{id}` | Update a patient |
| PATCH | `/api/patients/{id}/discharge` | Mark a patient as discharged |
| DELETE | `/api/patients/{id}` | Delete a patient |

## Deployment notes

The project uses Vercel Services to deploy the React frontend and FastAPI backend together. The `vercel.toml` file routes `/api/*` requests to FastAPI and all other routes to the Vite frontend.

Set the following Vercel environment variable for the API service:

```text
MONGO_URL
```

Use a MongoDB Atlas URI as its value. Never commit database credentials or `.env` files to GitHub.

## Screenshots

### Patient admission form

![Patient admission form](screenshots/admission-form.png)

### Backend structure

![Backend structure](screenshots/backend-structure.png)

### Frontend structure

![Frontend structure](screenshots/frontend-structure.png)
