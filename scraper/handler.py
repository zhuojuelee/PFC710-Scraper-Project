import logging

from main_scraper import scrape_and_write_to_s3

logger = logging.getLogger()
logger.setLevel('DEBUG')

successMsg = 'Successfully scraped and updated shoes data'

def lambda_handler(event, context):
    logger.info(f'Lambda invoked - beginning Footlocker Release page scraping')
    try:
        scrape_and_write_to_s3()

        logger.info(successMsg)
        # send sns

        return {
            'statusCode': 200,
            'message': successMsg
        }
    except Exception as e:
        logger.error(f'Errorr occured: {str(e)}')
        # send sns