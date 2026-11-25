# Admitly: Patient Admission Management

A web app where hospital staff can add, view, search, filter, edit, discharge and delete admitted patients.

- **Live app:** TODO: your Vercel link
- **Backend API:** TODO: your Render link (open `/docs` for the interactive API page)
- **GitHub:** https://github.com/VittalaRao/Admitly

## Screenshots

| Desktop | Tablet | Mobile |
|---|---|---|
| ![Desktop](docs/screenshots/desktop.png) | ![Tablet](docs/screenshots/tablet.png) | ![Mobile](docs/screenshots/mobile.png) |

![Patient list](docs/screenshots/patient-list.png)
![Validation error](docs/screenshots/validation.png)

## Features

1. Add a patient
2. View the list of all patients
3. Filter by Ward, Department and Doctor
4. Search patients by name
5. Edit a patient
6. Delete a patient, with a confirmation prompt
7. Mark a patient as Discharged, with a confirmation prompt
8. Responsive design for mobile, tablet and desktop

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite) |
| Backend | Python, FastAPI |
| Database | MongoDB (MongoDB Atlas in production) |
| Hosting | Vercel (frontend), Render (backend) |

Data is stored in MongoDB, so it stays saved after a server restart.

## Patient fields

| Field | Type | Rule |
|---|---|---|
| Name | Text | Required, letters only (single spaces allowed between words) |
| Age | Number | Required, whole number from 0 to 120 |
| Gender | Select | Required: Male, Female, Other |
| Ward | Select | Required: General, Emergency, Pediatrics, ICU |
| Department | Select | Required: Cardiology, Orthopedics, Pediatrics, Neurology |
| Doctor | Select | Required, must belong to the selected department |
| Admission date | Date | Required, cannot be in the future |
| Status | Select | Admitted or Discharged |

## Validation

Every rule above is checked in both places:

- **Frontend:** `frontend/src/utils.js` (`validatePatient`) shows an error before anything is sent.
- **Backend:** `backend/main.py` (Pydantic models) rejects invalid data with HTTP `400` and a clear message, for example `{"error": "Name is required and must contain letters only."}`. This protects the data even if someone calls the API directly.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/patients` | List all patients |
| POST | `/api/patients` | Add a patient |
| PUT | `/api/patients/{id}` | Edit a patient |
| PATCH | `/api/patients/{id}/discharge` | Mark a patient as Discharged |
| DELETE | `/api/patients/{id}` | Delete a patient |

## Project structure

```
Admitly/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── api.js
│   │   ├── config.js
│   │   ├── constants.js
│   │   ├── utils.js
│   │   └── components/
│   │       ├── PatientForm.jsx
│   │       ├── PatientFilters.jsx
│   │       └── PatientCard.jsx
│   ├── package.json
│   └── .env.example
├── docs/screenshots/
└── README.md
```

## Run locally

**Requirements:** Node.js 18+ (used only to run the React frontend), Python 3.10+, and MongoDB running locally or a free MongoDB Atlas cluster.

### 1. Clone the repo

```bash
git clone https://github.com/VittalaRao/Admitly.git
cd Admitly
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 3001
```

On macOS or Linux, activate with `source venv/bin/activate` instead.

The API runs at `http://localhost:3001`. By default it connects to `mongodb://localhost:27017`. To use another database, set `MONGO_URL` first:

```bash
set MONGO_URL=your-connection-string
```

(PowerShell: `$env:MONGO_URL="your-connection-string"`. macOS or Linux: `export MONGO_URL=...`)

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the link Vite prints, usually `http://localhost:5173`.

## Environment variables

Real values are never committed. See the `.env.example` files.

**Backend**

| Variable | Default | Purpose |
|---|---|---|
| `MONGO_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed frontend addresses, comma-separated, no trailing slash |

**Frontend**

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Backend address, without `/api/patients` |

## Deployment

1. **Database:** MongoDB Atlas free cluster, with a database user and network access allowed.
2. **Backend (Render):**
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment variables: `MONGO_URL` (Atlas string) and `CORS_ORIGINS` (the live frontend address)
3. **Frontend (Vercel):**
   - Root directory: `frontend`
   - Environment variable: `VITE_API_URL` (the live backend address)

The free Render tier sleeps when idle, so the first request after a quiet period can take 30 to 60 seconds.

## Author

TODO: Your full name
