# from config import password_encoding_salt
import hashlib

def hash_password(password, password_encoding_salt):
    hashed = hashlib.sha256((password + password_encoding_salt).encode('utf-8')).hexdigest()
    return hashed

if __name__ == '__main__':
    hashed = hash_password("steve", password_encoding_salt)
    print(hashed)
