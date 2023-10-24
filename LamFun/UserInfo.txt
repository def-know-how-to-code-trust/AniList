import json
import pymysql
import boto3
import hashlib
# congfig values
endpoint = 'dbuserinfo.cfqzogrx9hr6.us-east-1.rds.amazonaws.com'
username = 'admin'
password = '12121234'
database_name = 'User_Info'

# connection
connection = pymysql.connect(host=endpoint, user=username,
                             passwd=password, db=database_name)

# function to get specific user info


def get_user_info(u_id):
    print("curosr")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM userINFO WHERE email = %s", (u_id))
    row = cursor.fetchall()
    if not row:
        return{
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, user not found')
        }
    else:
        user_info = {
            'user_id': row[0][0],
            'username': row[0][1],
            'email': row[0][2],
            'password': row[0][3],
            'anilist_id': row[0][4],
            'profile_pic': row[0][5],
            'lang_p':row[0][6]
        }
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps(user_info)
        }
    return response


# funcion to get all user info
def get_all_user_info(event, context):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM userINFO")
    rows = cursor.fetchall()
    if not rows:
        return{
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, no users found')
        }
    else:
        user_info = []
        for row in rows:
            user_info.append({
                'user_id': row[0],
                'username': row[1],
                'email': row[2],
                'password': row[3],
                'anilist_id': row[4],
                'profile_pic': row[5]
            })

        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(user_info)
        }
        print(response)
    return response


# function to update user info
def update_user_info(event, context):
    try:
        Updated_user_info = json.loads(event['body'])
        N_u_id = Updated_user_info['user_id']
        N_u_name = Updated_user_info['username']
        N_u_email = Updated_user_info['email']
        N_u_password_raw = Updated_user_info['password']
        N_u_password = hash_string(N_u_password_raw)
        N_u_anilist_id = Updated_user_info['anilist_id']
        N_u_profile_pic = Updated_user_info['profile_pic']
        N_u_lang_p = Updated_user_info["lang_p"]
        cursor = connection.cursor()
        cursor.execute("UPDATE userINFO SET username = %s, email = %s,password=%s,profile_pic=%s,lang_p=%s WHERE user_id = %s",
                       (N_u_name, N_u_email, N_u_password, N_u_profile_pic ,N_u_lang_p, N_u_id))
        connection.commit()

        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('User info updated successfully')
        }
        return response
    except Exception as e:
        print(e)
        return{
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, occured while processing the request, upadate user info failed')
        }

# function to delete user info


def delete_user_info(u_id):
    cursor = connection.cursor()
    cursor.execute("DELETE FROM userINFO WHERE email = %s", (u_id))
    connection.commit()
    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },

        'body': json.dumps('User info deleted successfully')
    }
    return response


def add_user_info(event, context):
    try:
        user_info = json.loads(event['body'])
        print(user_info)
        u_name = user_info['username']
        u_email = user_info['email']
        u_password = user_info['password']
        pass_U_HASH = hash_string(u_password)
        u_lang_p = user_info['lang_p']
        # u_anilist_id = user_info['u_id']
        print("var loaded")
        cursor = connection.cursor()
        print("connected")
        cursor.execute("INSERT INTO userINFO (username,email,password,lang_p) VALUES (%s, %s, %s,%s)",
                       (u_name, u_email, pass_U_HASH,u_lang_p))
        connection.commit()
        create_anime_list(u_email)
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('User info added successfully')
        }
        return response
    except Exception as e:
        print(e)
        return{
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, occured while processing the request, add user info failed')
        }


def create_anime_list(email):
    try:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT user_id FROM userINFO WHERE email = %s", (email))
        row = cursor.fetchall()
        user_id = row[0][0]
        cursor.execute(
            "UPDATE userINFO SET anilist_id=%s WHERE email =%s", (user_id, email))
        connection.commit()
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Anime list created successfully')
        }
        return response
    except Exception as e:
        print(e)
        return{
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, occured while processing the request, add user info failed,animelist creation failed')
        }


def verify_user(event, context):
    email = json.loads(event['body'])['email']
    print("email", email)
    passPlain = json.loads(event['body'])['passwd']
    print("pass", passPlain)
    passHex = hash_string(passPlain)
    cursor = connection.cursor()
    cursor.execute("SELECT password FROM userINFO WHERE email = %s", (email))
    row = cursor.fetchall()
    if not row:
        return{
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, user not found')
        }
    else:
        user_info = {
            'password': row[0][0],
        }
        print("user stored pass", user_info['password'])
        print("calculated hash", passHex)
        if passHex == user_info['password']:
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },

                'body': json.dumps("REAL USER")
            }
            return response
        else:
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },

                'body': json.dumps('FAKE USER')
            }
            return response


def hash_string(plain):
    plain_byte = plain.encode()
    # creating a hash object
    sha1 = hashlib.sha1()
    # updating the paintextbytes to become bash obj
    sha1.update(plain_byte)
    # making the hash into readable hex
    hash_hex = sha1.hexdigest()
    return hash_hex


def lambda_handler(event, context):
    Operations = ['GET', 'POST', 'PUT', 'DELETE']
    qe = event.get('queryStringParameters')
    try:
        httpMethod = event['httpMethod']
        if httpMethod == 'GET':
            if qe == None:
                print("no qw",qe)
                return get_all_user_info(event, context)
            else:
                print("yes Qw",qe)
                return get_user_info(qe["head"])
        elif httpMethod == 'POST':
            if qe == None:
                return add_user_info(event, context)
            else:
                print("verify_user")
                return verify_user(event, context)
        elif httpMethod == 'PUT':
            return update_user_info(event, context)
        elif httpMethod == 'DELETE':
            print('DELETE CALLED')
            return delete_user_info(qe["head"])
        else:
            return{
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },

                'body': json.dumps('Error, occured while processing the request probably wrong http method')
            }
    except Exception as e:
        print(e)
        return{
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, occured while processing the request,error in lambda function, probably wrong http method')
        }
