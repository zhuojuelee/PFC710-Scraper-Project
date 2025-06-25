import boto3
import logging

logger = logging.getLogger()
logger.setLevel('DEBUG')
prefix = '[SNS]'

class SnsClient:
    def __init__(self):
        self.topicArn = 'arn:aws:sns:us-east-1:392175866244:shoes-topic'
        self._client = boto3.client('sns')

    def send_message(self, subject, msg):
        self._client.publish(
            TopicArn = self.topicArn,
            Subject = subject,
            Message = msg
        )
        logger.info(f'{prefix}: Successfully notified subscribers')
