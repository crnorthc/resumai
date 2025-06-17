import os
from cryptography.fernet import Fernet


def encrypt_api_key(api_key: str):
    raw_key = os.environ.get("KEY_ENCRYPTION_SEED")

    if not raw_key:
        raise RuntimeError("Could not encrypt api key")

    fernet = Fernet(f"{raw_key}=".encode())

    return fernet.encrypt(api_key.encode()).decode()


def decrypt_api_key(encrypted_api_key: str):
    raw_key = os.environ.get("KEY_ENCRYPTION_SEED")

    if not raw_key:
        raise RuntimeError("Could not encrypt api key")

    fernet = Fernet(f"{raw_key}=".encode())

    return fernet.decrypt(encrypted_api_key.encode()).decode()
