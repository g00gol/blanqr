from fastapi import APIRouter, HTTPException, Depends
import stripe
import os

from db import get_db_async
from models import SignUpRequest, LoginRequest
from utils import hash_password, verify_password
from core import create_access_token
from dependencies import get_current_user, validate_jwt
from models import UserInDB

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.get("/link_stripe", dependencies=[Depends(get_current_user)])
async def link_stripe():
    account = stripe.Account.create(type="standard")
    callback_url = "http://localhost:5173/dashboard"

    account_link = stripe.AccountLink.create(
        account=account.id,
        refresh_url=f"{callback_url}/stripe-linked",
        return_url=f"{callback_url}/stripe-linked?account_id={account.id}",
        type="account_onboarding",
    )

    return {"url": account_link.url, "account_id": account.id}


@router.post("/link_stripe")
async def link_stripe(payload: dict, current_user: UserInDB = Depends(get_current_user)):
    account_id = payload.get("account_id")
    if not account_id:
        raise HTTPException(status_code=400, detail="Invalid account id")
    
    db = await get_db_async("blanqr")
    users_collection = db["users"]
    user = await users_collection.find_one({"_id": current_user.id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"stripe_user_id": account_id}}
    )

    return {"message": "Stripe account linked successfully"}


@router.get("/status")
async def get_stripe_status(current_user: UserInDB = Depends(get_current_user)):
    db = await get_db_async("blanqr")
    users_collection = db["users"]
    user = await users_collection.find_one({"_id": current_user.id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"stripe_user_id": user["stripe_user_id"]}


@router.post("/signup")
async def signup(user: SignUpRequest):
    db = await get_db_async("blanqr")
    users_collection = db["users"]

    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = {
        "email": user.email,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "hashed_password": hash_password(user.password),
        "stripe_user_id": None,
    }

    _id = await users_collection.insert_one(new_user)
    new_user["_id"] = str(_id.inserted_id)

    return {"message": "User created successfully", "user": new_user}


@router.post("/login")
async def login(payload: LoginRequest):
    db = await get_db_async()
    user = await db["users"].find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"])})
    return {
        "access_token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "username": user["username"],
        }
    }