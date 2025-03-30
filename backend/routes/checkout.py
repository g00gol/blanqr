from fastapi import APIRouter, Request, Depends
import stripe
import os

from dependencies import get_current_user
from models.user import UserInDB

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/")
async def create_checkout_session(
    request: Request,
    current_user: UserInDB = Depends(get_current_user)
):
    data = await request.json()
    amount = data.get("amount", 100)

    print("Creating payment for:", current_user.email)

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {"name": "QR Payment"},
                "unit_amount": amount,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url="http://localhost:5173/success",
        cancel_url="http://localhost:5173/cancel",
        metadata={
            "user_id": str(current_user.id),
            "email": current_user.email,
        },
    )

    return {"url": session.url}
