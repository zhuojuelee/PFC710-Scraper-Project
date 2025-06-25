import logging

from aws.sns_client import SnsClient
from main_scraper import scrape_and_write_to_s3

logger = logging.getLogger()
logger.setLevel('DEBUG')

snsClient = SnsClient()

msgSubject = 'Shoes Scraper Results'
successMsg = 'Successfully scraped and updated shoes data'

def lambda_handler(event, context):
    logger.info(f'Lambda invoked - beginning Footlocker Release page scraping')
    try:
        newEntries = scrape_and_write_to_s3()

        logger.info(f'[Lambda:Handler] {successMsg}')
        logger.info(f'[Lambda:Handler] {len(newEntries)} new entries added')
        snsClient.send_message(msgSubject, successMsg)

        return {
            'statusCode': 200,
            'message': successMsg
        }
    except Exception as e:
        errMsg = str(e)
        logger.error(f'[Lambda:Handler] Error occured: {errMsg}')
        snsClient.send_message(msgSubject, f'An error occurred: {errMsg}')
        raise
