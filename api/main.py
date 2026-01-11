from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import uuid

# Load env vars from the web/.env.local file (since we share them)
load_dotenv(dotenv_path="../web/.env.local")

app = FastAPI()

# Allow CORS for Next.js frontend
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Warning: Supabase credentials not found in env.")

supabase: Client = create_client(url, key)

@app.get("/")
def read_root():
    return {"message": "E-Commerce Admin API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Generate unique filename
        file_ext = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        bucket_name = "products" # We need to create this bucket in Supabase!

        # Read file content
        file_content = await file.read()

        # Upload to Supabase Storage
        res = supabase.storage.from_(bucket_name).upload(
            file_name,
            file_content,
            {"content-type": file.content_type}
        )

        # Get Public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        return {"url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
