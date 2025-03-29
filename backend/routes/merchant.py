from fastapi import APIRouter
import stripe
import os

from db import get_db_async
from models import User

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/onboard")
async def create_account_link():
    account = stripe.Account.create(type="standard")
    callback_url = "http://localhost:5173/merchant/onboarding"

    account_link = stripe.AccountLink.create(
        account=account.id,
        refresh_url=f"{callback_url}/refresh",
        return_url=f"{callback_url}/complete?account_id={account.id}",
        type="account_onboarding",
    )

    return {"url": account_link.url, "account_id": account.id}

@router.post("/signup")
async def signup(user: User):
    db = await get_db_async()
    users_collection = db["users"]

    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "User already exists"}

    new_user = {
        "email": user.email,
        "username": user.username,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "password": user.password,
        "stripe_user_id": None,
    }

    _id = await users_collection.insert_one(new_user)
    new_user["_id"] = str(_id.inserted_id)

    return {"message": "User created successfully", "user": new_user}