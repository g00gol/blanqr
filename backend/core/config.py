from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
