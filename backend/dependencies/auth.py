from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId

from core import settings
from models.user import UserInDB
from db import get_db_async

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/merchant/login")

def validate_jwt(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise ValueError
        return user_id
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid credentials")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    user_id = validate_jwt(token)

    db = await get_db_async()
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserInDB(**user)
