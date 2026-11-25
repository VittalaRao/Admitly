import os
from datetime import date
from typing import Annotated, Literal

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, StringConstraints, field_validator
from pymongo import MongoClient
from pymongo.errors import PyMongoError

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=3000)
patients_collection = client["admitly"]["patients"]

DEPARTMENTS = {
    "Cardiology": ["Dr. Anil Sharma", "Dr. Meera Nair"],
    "Orthopedics": ["Dr. Rahul Verma", "Dr. Sneha Iyer"],
    "Pediatrics": ["Dr. Kavita Rao", "Dr. Arjun Menon"],
    "Neurology": ["Dr. Priya Das", "Dr. Vikram Singh"],
}

app = FastAPI()

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientIn(BaseModel):
    name: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            min_length=1,
            max_length=100,
            pattern=r"^[A-Za-z]+( [A-Za-z]+)*$",
        ),
    ]
    age: Annotated[int, Field(strict=True, ge=0, le=120)]
    gender: Literal["Male", "Female", "Other"]
    ward: Literal["General", "Emergency", "Pediatrics", "ICU"]
    department: Literal["Cardiology", "Orthopedics", "Pediatrics", "Neurology"]
    doctor: str
    status: Literal["Admitted", "Discharged"]
    admission_date: date

    @field_validator("doctor")
    @classmethod
    def doctor_in_department(cls, value, info):
        department = info.data.get("department")
        if department and value not in DEPARTMENTS[department]:
            raise ValueError("Doctor does not belong to this department.")
        return value

    @field_validator("admission_date")
    @classmethod
    def not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Admission date cannot be in the future.")
        return value


class Patient(PatientIn):
    id: str


def serialize(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "age": doc["age"],
        "gender": doc.get("gender", ""),
        "ward": doc.get("ward", ""),
        "department": doc.get("department", ""),
        "doctor": doc.get("doctor", ""),
        "status": doc.get("status", "Admitted"),
        "admission_date": doc.get("admission_date", ""),
    }


ERROR_MESSAGES = {
    "name": "Name is required and must contain letters only.",
    "age": "Age must be a whole number between 0 and 120.",
    "gender": "Please choose a valid gender.",
    "ward": "Please choose a valid ward.",
    "department": "Please choose a valid department.",
    "doctor": "Please choose a valid doctor from the selected department.",
    "status": "Status must be Admitted or Discharged.",
    "admission_date": "Please enter a valid admission date that is not in the future.",
}


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    field = exc.errors()[0]["loc"][-1]
    message = ERROR_MESSAGES.get(field, "Invalid request.")
    return JSONResponse(status_code=400, content={"error": message})


@app.exception_handler(PyMongoError)
async def database_handler(request: Request, exc: PyMongoError):
    return JSONResponse(
        status_code=503, content={"error": "Database is unavailable."}
    )


@app.get("/")
def root():
    return {"status": "Admitly API is running"}


@app.get("/api/patients")
def list_patients():
    docs = patients_collection.find().sort("_id", 1)
    return [serialize(doc) for doc in docs]


@app.post("/api/patients", status_code=201)
def create_patient(data: PatientIn):
    result = patients_collection.insert_one(data.model_dump(mode="json"))
    return Patient(id=str(result.inserted_id), **data.model_dump())


@app.put("/api/patients/{patient_id}")
def update_patient(patient_id: str, data: PatientIn):
    try:
        oid = ObjectId(patient_id)
    except InvalidId:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})

    result = patients_collection.update_one(
        {"_id": oid}, {"$set": data.model_dump(mode="json")}
    )
    if result.matched_count == 0:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})

    return Patient(id=str(oid), **data.model_dump())


@app.patch("/api/patients/{patient_id}/discharge")
def discharge_patient(patient_id: str):
    try:
        oid = ObjectId(patient_id)
    except InvalidId:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})

    result = patients_collection.update_one(
        {"_id": oid}, {"$set": {"status": "Discharged"}}
    )
    if result.matched_count == 0:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})

    return serialize(patients_collection.find_one({"_id": oid}))


@app.delete("/api/patients/{patient_id}", status_code=204)
def delete_patient(patient_id: str):
    try:
        oid = ObjectId(patient_id)
    except InvalidId:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})

    result = patients_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"error": "Patient not found."})
