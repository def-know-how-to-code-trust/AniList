import json
import boto3
import pymysql

# config values for database
endpoint = 'dbuserinfo.cfqzogrx9hr6.us-east-1.rds.amazonaws.com'
username = 'admin'
password = '12121234'
database_name = 'User_Info'

# initialising connection
connection = pymysql.connect(host=endpoint, user=username,
                             passwd=password, db=database_name)

# function to get specific user anime list


def get_user_list(event, context):
    u_id = json.loads(event['body'])['u_id']
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM userLIST WHERE user_id = %s", (u_id))
    rows = cursor.fetchall()
    if not rows:
        return{

            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Error, user not found')
        }
    else:
        user_list = []
        for row in rows:
            user_list.append({
                'anilist_id': row[0],
                'anime_id': row[1],
                'status': row[2],
                'rating': row[3]
            })
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps(user_list)
        }
    return response

# function to create or upsate to user list


def update_user_list(event, context):
    body = json.loads(event['body'])
    a_id = body['anilist_id']
    ani_id = body['anime_id']
    status = body['status']
    rating = body['rating']
    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM userLIST WHERE anilist_id = %s AND anime_id = %s", (a_id, ani_id))
    row = cursor.fetchall()
    if not row:
        cursor.execute("INSERT INTO userLIST VALUES (%s,%s,%s,%s)",
                       (a_id, ani_id, status, rating))
        connection.commit()
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('User list created')
        }
    else:
        cursor.execute("UPDATE userLIST SET status = %s, rating = %s WHERE anilist_id = %s AND anime_id = %s",
                       (status, rating, a_id, ani_id))
        connection.commit()
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('User list updated')
        }
    return response

# function to delete user list


def delete_user_list(event, context):
    body = json.loads(event['body'])
    a_id = body['anilist_id']
    ani_id = body['anime_id']
    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM userLIST WHERE anilist_id = %s AND anime_id = %s", (a_id, ani_id))
    row = cursor.fetchall()
    if not row:
        response = {
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('Error, user or anime not found', a_id, ani_id, '')
        }
    else:
        cursor.execute(
            "DELETE FROM userLIST WHERE anilist_id = %s AND anime_id = %s", (a_id, ani_id))
        connection.commit()
        response = {

            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps('User list deleted for anime id: ' + ani_id + ' and user id: ' + a_id + '')
        }
    return response

# lambda handler


def lambda_handler(event, context):
    operations = ['GET', 'POST', 'PUT', 'DELETE']
    operation = event['httpMethod']
    try:
        if operation not in operations:
            return {
                'statusCode': 500,
                'body': json.dumps('http method have an error please check')
            }
        else:
            if operation == 'GET':
                return get_user_list(event, context)
            elif operation == 'POST':
                return update_user_list(event, context)
            elif operation == 'DELETE':
                return 'DELETE'
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error within the methods called check log')
        }
