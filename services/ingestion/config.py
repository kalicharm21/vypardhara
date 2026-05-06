"""Application configuration loaded from environment."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://vyapar:changeme@localhost:5432/vyapardhara"
    pseudonym_salt: str = "dev-salt"
    poll_interval_labour: int = 300
    poll_interval_factories: int = 300
    poll_interval_kspcb: int = 600
    poll_interval_shop_estab: int = 300


settings = Settings()
