import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

#get the service resource
dynamodb = boto3.resource('dynamodb')

#geting the table
table = dynamodb.Table('AnimeDB')

#getting the anime list
def getAnimeList():
    response = table.scan()
    return response['Items']

#searching anime by name
def getAnimeByName(name):
    response = table.scan(
        FilterExpression=Attr('name').contains(name)
    )
    return response['Items']

#searching anime by genre
def getAnimeByGenre(genre):
    response = table.scan(
        FilterExpression=Attr('genre').contains(genre)
    )
    return response['Items']

def lambda_handler(event, context):
    print(event)
    operation = ['GET', 'POST', 'PUT', 'DELETE']

    operation = event['httpMethod']

    #basic checking if the operation is valid
    if operation not in operation:
        return {
        'statusCode': 500,
        'body': json.dumps('http method have an error please check')
    }
    else:
        if operation == 'GET':
            return getAnimeList()
        elif operation == 'POST':
            return 'POST'
        elif operation == 'PUT':
            return 'PUT'
        elif operation == 'DELETE':
            return 'DELETE'
