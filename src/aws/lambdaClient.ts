import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

const FUNCTION_NAME = 'ShoesDataLambda';

class AwsLambdaClient {
  client;

  constructor() {
    this.client = new LambdaClient({ });
  }

  async invokeShoesLambda() {
    const invokeCmd = new InvokeCommand({
      FunctionName: FUNCTION_NAME,
    });

    try {
      const lambdaRes = await this.client.send(invokeCmd);
      
      if (lambdaRes.$metadata.httpStatusCode !== 200) {
        throw new Error(`An error occurred when invoking shoes lambda: ${lambdaRes.$metadata}`);
      }

    } catch(e) {
      if (e instanceof Error) {
        console.error(`Failed to invoke lambda: ${e.message}`);
      } else {

      }console.error('Failed to invoke lambda - unknown error');
    }
  };
}

const awsLambdaClientSingleton = new AwsLambdaClient;

export default awsLambdaClientSingleton;
