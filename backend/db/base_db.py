from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os

client: Optional[AsyncIOMotorClient] = None
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

async def connect_to_mongo() -> None:
    global client
    client = AsyncIOMotorClient(MONGO_URI)
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connection successful.")
    except Exception as e:
        raise Exception("❌ MongoDB connection failed:", e)

async def close_mongo_connection() -> None:
    global client
    if client:
        client.close()
        print("🛑 MongoDB connection closed.")

async def get_db_async(db_name: str = "blanqr") -> AsyncIOMotorDatabase:
    if client is None:
        raise Exception("Database client not initialized.")
    return client[db_name]
