import boto3
import json

admin_topic_arn = 'arn:aws:sns:us-east-1:392175866244:shoes-topic'
subscriber_topic_arn = 'arn:aws:sns:us-east-1:392175866244:subscriber-topic'
all_topics = [admin_topic_arn, subscriber_topic_arn]
cors_headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

def lambda_handler(event, context):
    # init SNS client
    client = boto3.client('sns')

    # get path and email extraction to check if it was triggered by the subscribe endpoint
    path = event.get("path")
    email = event.get("queryStringParameters", {}).get("email")

    # check if it was triggered via the subscribe API
    if path == "/sns/subscribe" and email:
        print(f"New request t subscribe from email: {email}")
        # alert admin of new subscriber
        client.publish(
            TopicArn = admin_topic_arn,
            Subject = 'New Subscriber',
            Message = f"Received subscription request: {email}"
        )

        # subscribe new email to subscriber topic
        client.subscribe(
            TopicArn=subscriber_topic_arn,
            Protocol='email',
            Endpoint=email,
        )

        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": f"Received subscription request: {email}"
        }
    
    # publish message to all subscribers
    for topic_arn in all_topics:
        client.publish(
            TopicArn = topic_arn,
            Subject = 'Dashboard Update',
            Message = 'Check out the dashboard!'
        )

    return {
        'statusCode': 200,
        'body': json.dumps('SNS Lambda notification invoked')
    }
    
