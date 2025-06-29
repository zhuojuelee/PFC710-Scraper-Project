import logging
import json

from aws.sns_client import SnsClient
from main_scraper import scrape_and_write_to_s3

logger = logging.getLogger()
logger.setLevel('DEBUG')

snsClient = SnsClient()

msgSubject = 'Shoes Scraper Results'
successMsg = 'Successfully scraped and updated shoes data'
failedMsg = 'Failed to scrape data, an exception occurred'

def lambda_handler(event, context):
    logger.info(f'Lambda invoked - beginning Footlocker Release page scraping')

    if 'Records' in event:
        logger.info(f'Lambda invoked by {event.Records[0].eventSource}')
    elif 'httpMethod' in event:
        logger.info(f'Lambda invoked by API gateway')
    elif 'source' in event:
        logger.info(f'Lambda invoked by Cloud Watch event')

    try:
        newEntries = scrape_and_write_to_s3()

        logger.info(f'[Lambda:Handler] {successMsg}')
        logger.info(f'[Lambda:Handler] {len(newEntries)} new entries added')
        snsClient.send_message(f'{msgSubject}: Success', f'{successMsg} - {newEntries} added')

        return {
            'statusCode': 200,
            'message': json.dumps(successMsg)
        }
    except Exception as e:
        errMsg = str(e)
        logger.error(f'[Lambda:Handler] Error occured: {errMsg}')
        snsClient.send_message(f'{msgSubject}: Failed', f'An error occurred: {errMsg}')

        return {
            'statusCode': 500,
            'message': json.dumps(failedMsg)
        }
