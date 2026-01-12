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
    "*", # Allow all origins for production
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

# --- Payment Features (Simulated for Phase 5) ---

from pydantic import BaseModel

class PaymentIntentRequest(BaseModel):
    order_id: str

@app.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Simulates calling Stripe to get a client_secret.
    In a real app, we would use the order_id to fetch the amount from DB
    and create a real Stripe Intent.
    """
    try:
        # Mock Logic:
        # 1. Verify order exists (optional, skipping for speed)
        # 2. Return a fake secret
        return {
            "client_secret": f"simulated_secret_{uuid.uuid4()}",
            "amount": 100.00, # Mocked amount
            "currency": "usd"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/webhook")
async def payment_webhook(request: dict):
    """
    Simulates a Stripe Webhook.
    When payment is successful, we update the order status in Supabase.
    """
    try:
        # In real life, we verify signature here.
        event_type = request.get("type")
        data = request.get("data", {})
        
        if event_type == "payment_intent.succeeded":
            order_id = data.get("order_id")
            transaction_id = data.get("id", str(uuid.uuid4()))
            amount = data.get("amount", 0) / 100 # Stripe uses cents
            
            # 1. Update Order Status
            supabase.table("orders").update({"status": "Processing", "payment_status": "Paid"}).eq("id", order_id).execute()
            
            # 2. Log Transaction
            supabase.table("transactions").insert({
                "order_id": order_id,
                "provider_id": transaction_id,
                "amount": amount,
                "status": "success",
                "provider": "simulated"
            }).execute()
            
            return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
