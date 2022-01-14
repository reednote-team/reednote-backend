from config import jwt_encoding_salt
import time
import jwt

key = jwt_encoding_salt

def get_token(payload: dict) -> str:
    # header
    headers = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload['exp'] = int(time.time() + 1800)
    token = jwt.encode(headers=headers, key=key, payload=payload)
    return token

def use_token(token: str) -> dict:
    try:
        return jwt.decode(token, key=key, algorithms="HS256")
    except jwt.DecodeError:
        return {} 