# from config import password_encoding_salt
import hashlib

def hash_password(password, password_encoding_salt):
    hashed = hashlib.sha256((password + password_encoding_salt).encode('utf-8')).hexdigest()
    return { 'hashed': hashed, 'salt': password_encoding_salt }

if __name__ == '__main__':
    dic = hash_password("steve", password_encoding_salt)
    print(dic)
