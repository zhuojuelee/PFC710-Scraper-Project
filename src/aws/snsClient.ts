import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const TOPIC_ARN = 'arn:aws:sns:us-east-1:392175866244:shoes-topic';

class AwsSnsClient {
  client;

  constructor() {
    this.client = new SNSClient({ });
  };

  async sendMessage(msg: string) {
    const publishCmd = new PublishCommand({
      Message: msg,
      TopicArn: TOPIC_ARN
    });

    await this.client.send(publishCmd);
  };
}

const awsSnsClientSingleton = new AwsSnsClient();

export default awsSnsClientSingleton;
