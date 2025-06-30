import boto3
import json

arn = 'arn:aws:sns:us-east-1:392175866244:shoes-topic'

def lambda_handler(event, context):
    # init SNS client
    client = boto3.client('sns')

    # get path and email extraction to check if it was triggered by the subscribe endpoint
    path = event.get("path")
    email = event.get("queryStringParameters", {}).get("email")

    # check if it was triggered via the subscribe API
    if path == "/sns/subscribe" and email:
        print(f"New request t subscribe from email: {email}")
        client.publish(
            TopicArn = arn,
            Subject = 'New Subscriber',
            Message = f"Received subscription request: {email}"
        )

        client.subscribe(
            TopicArn=arn,
            Protocol='email',
            Endpoint=email,
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": f"Received subscription request: {email}"
        }
    
    client = boto3.client('sns')
    client.publish(
        TopicArn = arn,
        Subject = 'Dashboard Update',
        Message = 'Check out the dashboard!'
    )

    return {
        'statusCode': 200,
        'body': json.dumps('SNS Lambda notification invoked')
    }
    
