from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    email: str
    username: str
    firstName: str
    lastName: str
    password: str
    stripe_user_id: Optional[str] = None