import boto3
import csv
import logging

from io import StringIO

logger = logging.getLogger()
logger.setLevel('DEBUG')
prefix = '[S3]'

def map_to_writer_row(row):
    return row.split(',')

class S3Client:
    def __init__(self):
        self.key = 'data.csv'
        self.bucket = 'pfc710-shoes'
        self._client = boto3.client('s3')
    
    # returns list of csv rows - ['row1', 'row2']
    def get_shoes_data(self):
        res = self._client.get_object(
            Bucket = self.bucket,
            Key = self.key,
        )

        logger.info(f'{prefix}: Successfully fetched shoes data')

        rawData = res['Body'].read()
        csvText = rawData.decode('utf-8')
        data = csvText.splitlines()
        reader = csv.reader(data)
        csvData = [','.join(row) for row in reader]
        return csvData
    
    def get_shoes_ids_map(self):
        shoesData = self.get_shoes_data()
        
        logger.info(f'{prefix}: Successfully fetched shoes data for IDs')
        ids = {}
        for data in shoesData:
            shoeId = data.split(',')[0]
            if shoeId not in ids:
                ids[shoeId] = True
        return ids
    
    # csvData expects list of csv rows - ['row1', 'row2']
    def upload_shoes_data(self, csvData):
        # setup file writer
        buffer = StringIO()
        writer = csv.writer(buffer)

        content = map(map_to_writer_row, csvData)
        writer.writerows(content)

        self._client.put_object(
            Bucket = self.bucket,
            Key = self.key,
            Body = buffer.getvalue(),
            ContentType = 'text/csv'
        )

        logger.info(f'{prefix}: Successfully uploaded shoes data')
