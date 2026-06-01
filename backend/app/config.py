from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/order_management"
    frontend_url: str = "http://localhost:5173"
    cors_origins: str = "*"

    @property
    def allowed_cors_origins(self) -> List[str]:
        origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

        if "*" in origins:
            return ["*"]

        default_origins = [self.frontend_url, "http://localhost:3000", "http://localhost:5173"]
        return list(dict.fromkeys(origins + default_origins))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
