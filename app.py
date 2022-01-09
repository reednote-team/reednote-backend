from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import db

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Note(BaseModel):
    name: str
    id: str
    content: str

@app.get("/api/notes")
def get_notes():
    notes = db.load_notes()
    return notes

@app.post('/api/notes')
def create_note(note: Note):
    id = str(uuid.uuid4())
    return db.save_note(id, note.name, note.content)

@app.put('/api/notes/{id}')
def update_note(id, note: Note):
    return db.save_note(id, note.name, note.content)

@app.delete('/api/notes/{id}')
def delete_note(id):
    db.delete_note(id)

@app.get("/api/notes/{id}")
def get_note(id):
    note = db.load_note(id)
    return note



