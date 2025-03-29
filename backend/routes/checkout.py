from fastapi import APIRouter, Request
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/")
async def create_checkout_session(request: Request):
    data = await request.json()
    amount = data.get("amount", 100)

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
    )
    return {"url": session.url}
