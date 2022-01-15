import os
import sqlite3
from pathlib import Path
import json as jsoner
from password_validation import hash_password
import uuid

def create_user_table(conn):
    conn.execute("""
    CREATE TABLE IF NOT EXISTS USERS (
        USER_ID CHAR(36) PRIMARY KEY NOT NULL, 
        USER_NAME TEXT NOT NULL,
        USER_EMAIL TEXT NOT NULL,
        USER_LEVEL CHAR(1) NOT NULL,
        USER_HASHED_PW CHAR(64) NOT NULL
    );
    """)

def create_user(user_id, user_name, user_email, user_level, user_password):
    ''' Create User
    Parameters:
        user_id
        user_name
        user_email
        user_level
        user_password
    Returns:
        { 'status': 'email_already_exists', 'user_id': '' }
        { 'status': 'success', 'user_id': user_id }
    '''
    conn = sqlite3.connect("reednote.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM USERS WHERE USER_EMAIL == '{ user_email }';")
    users = cur.fetchall()
    if (len(users) != 0): 
        return { 'status': 'email_already_exists', 'user_id': '' }
    else:
        hashed_password = hash_password(user_password, user_id)
        conn.execute(
            f"INSERT INTO USERS (USER_ID, USER_NAME, USER_EMAIL, USER_LEVEL, USER_HASHED_PW) VALUES ('{ user_id }', '{ user_name }', '{ user_email }', '{ user_level }', '{ hashed_password }');"
        )
        conn.commit()
        return { 'status': 'success', 'user_id': user_id }

def login_check(user_id, user_email, user_password):
    ''' Login Check
    Parameters:
        user_id - can be queried from DB by method get_uuid_by_email()
        user_email
        user_password
    Returns:
        { 'status': 'invalid_userid', 'user_id': user_id }
        { 'status': 'success', 'user_id': user_id }
        { 'status': 'password_not_matched', 'user_id': user_id }
    '''
    conn = sqlite3.connect("reednote.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM USERS WHERE USER_ID == '{ user_id }';")
    user = cur.fetchall()
    if (len(user) == 0):
        return { 'status': 'invalid_userid', 'user_id': user_id }
    elif (user[0][4] == hash_password(user_password, user_id)):
        return { 'status': 'success', 'user_id': user_id }
    else:
        return { 'status': 'password_not_matched', 'user_id': user_id }


def get_uuid_by_email(user_email):
    conn = sqlite3.connect("reednote.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM USERS WHERE USER_EMAIL == '{ user_email }';")
    user = cur.fetchall()
    if (len(user) == 0):
        return ''
    else:
        return user[0][0]


def create_note_table(conn):
    conn.execute("""
    CREATE TABLE IF NOT EXISTS NOTES (
        NOTE_ID CHAR(36) PRIMARY KEY NOT NULL,
        NOTE_NAME TEXT NOT NULL,
        NOTE_OWNER CHAR(36) NOT NULL
    );
    """)


def load_notes():
    conn = sqlite3.connect("reednote.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM NOTES;")
    notes = cur.fetchall()
    json = {"count": len(notes), "data": []}
    for note in notes:
        json["data"].append({"id": note[0], "name": note[1]})
    return jsoner.dumps(json)


def load_note(uid):
    conn = sqlite3.connect("reednote.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM NOTES WHERE NOTE_UID == '{uid}';")
    note = cur.fetchone()
    content = ""
    with open(f"./notes/{uid}.md", "r") as note_file:
        content = note_file.read()
    json = {"id": note[0], "name": note[1], "content": content}
    return jsoner.dumps(json)


def save_note(uid, name, content):
    conn = sqlite3.connect("reednote.db")
    conn.execute(
        f"REPLACE INTO NOTES (NOTE_UID, NOTE_NAME) VALUES ('{uid}', '{name}');"
    )
    conn.commit()
    with open(f"./notes/{uid}.md", "w") as note_file:
        note_file.write(content)
    return jsoner.dumps({
        "id": uid,
        "name": name
    })


def delete_note(uid):
    conn = sqlite3.connect("reednote.db")
    conn.execute(
        f"DELETE FROM NOTES WHERE NOTE_UID == '{uid}';"
    )
    conn.commit()
    os.remove(f'./notes/{uid}.md')



def db_init():
    conn = sqlite3.connect("reednote.db")
    store_folder = Path("./notes")
    if not store_folder.is_dir():
        store_folder.mkdir()
    create_note_table(conn)
    create_user_table(conn)

def test():
    create_user(str(uuid.uuid4()), "Ex10si0n", "p1908326@ipm.edu.mo", '1', 'sbyzb')
    create_user(str(uuid.uuid4()), "KevynTang", "p1908XXX@ipm.edu.mo", '1', 'sbyzb')

    print(login_check(get_uuid_by_email('p1908326@ipm.edu.mo'), 'p1908326@ipm.edu.mo', 'sbyzb'))
    print(login_check(get_uuid_by_email('p1908XXX@ipm.edu.mo'), 'p1908XXX@ipm.edu.mo', 'sbyzb'))
    print(login_check(get_uuid_by_email('p1908XXX@ipm.edu.mo'), 'p1908XXX@ipm.edu.mo', 'qwerty'))
    print(login_check(get_uuid_by_email('p1908345@ipm.edu.mo'), 'p1908XXX@ipm.edu.mo', 'qwerty'))

db_init()
test()
