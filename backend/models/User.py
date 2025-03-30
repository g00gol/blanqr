from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from typing import Optional
from bson import ObjectId
from pydantic.json_schema import JsonSchemaValue


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, schema: JsonSchemaValue, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return {"type": "string"}



class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    stripe_user_id: Optional[str] = None


class UserPublic(UserBase):
    pass


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    hashed_password: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class SignUpRequest(BaseModel):
    email: EmailStr
    username: str
    firstName: str
    lastName: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str