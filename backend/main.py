from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv

from routes import merchant_router, checkout_router
from db import connect_to_mongo, close_mongo_connection

load_dotenv()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checkout_router, prefix="/checkout", tags=["checkout"])
app.include_router(merchant_router, prefix="/merchant", tags=["merchant"])

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()