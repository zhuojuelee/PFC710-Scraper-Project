import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const BUCKET = 'pfc710-shoes';
const KEY = 'data.csv'

class AwsS3Client {
  client;

  constructor() {
    this.client = new S3Client({});
  }

  async getShoesData() {
    let body = undefined;
    const getObjectCmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
    });

    try {
      const res = await this.client.send(getObjectCmd);

      if (res.$metadata.httpStatusCode !== 200) {
        throw new Error(`An error when fetching S3 for shoes data: ${res.$metadata}`);
      }

      body = res.Body;
      return body;
    } catch(e) {
      if (e instanceof Error) {
        console.error(`An error occurred when fetching S3 for shoes data: ${e.message}`);
      } else {
        console.error('An error occurred when fetching S3 shoes data');
      }
    } finally {
        return body;
    }
  }
}

const awsS3ClientSingleton = new AwsS3Client();

export default awsS3ClientSingleton;
