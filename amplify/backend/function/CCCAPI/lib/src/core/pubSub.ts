import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { device } from "aws-iot-device-sdk";

import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetIdCommand } from '@aws-sdk/client-cognito-identity';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';


/**
 * 
 * 
 * 
 * *NOTE* The code below is used for reference only, it does not currently work. 
 * Do not use
 * 
 * 
 */

const region = 'eu-north-1';
const identityPoolId = 'eu-north-1:23c373fc-bcec-4abf-8fdd-2720d885c68b';
const host = 'a1744m7l3kqoyy-ats.iot.eu-north-1.amazonaws.com';

const cognitoIdentityServiceProvider = new CognitoIdentityProvider({ region: 'eu-north-1' })
const credentials = defaultProvider();

const cognitoIdentityClient = new CognitoIdentityClient({ region });

async function getAwsCredentials() {
  const getIdResult = await cognitoIdentityClient.send(new GetIdCommand({ IdentityPoolId: identityPoolId }));
  const getCredentialsResult = await cognitoIdentityClient.send(
    new GetCredentialsForIdentityCommand({ IdentityId: getIdResult.IdentityId })
  );
  return getCredentialsResult.Credentials;
}


const getIotData = async () => {
  const cognitoCreds = (await cognitoIdentityServiceProvider.config.credentials())
  // const creds = await credentials();
  return new device({
    region: 'eu-north-1',
    protocol: 'wss',
    clientId: "cccApiFunction",
    host: "a1744m7l3kqoyy-ats.iot.eu-north-1.amazonaws.com",
    debug: true,
    accessKeyId: cognitoCreds.accessKeyId,
    secretKey: cognitoCreds.secretAccessKey,
    sessionToken: cognitoCreds.sessionToken,
  });
};



async function sendMessageToTopi2c(topic: string, message: string) {
  const iotDataClient = new IoTDataPlaneClient({ region, credentials: credentials, endpoint: host });

  const payload = JSON.stringify({ message: 'Hello from Express' });
  try {

    await iotDataClient.send(new PublishCommand({ topic, payload: new TextEncoder().encode(JSON.stringify({ message: 'Hello from Express' })) }));
  } catch (error) {
    console.error(error)
  }

}

async function sendMessageToTopic(topic: string, message: string) {
  const creds = await credentials();

  await new Promise<void>((resolve, reject) => {

    const d = new device({
      region,
      protocol: 'wss',
      clientId: "cccApiFunction",
      debug: true,
      accessKeyId: creds.accessKeyId,
      secretKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
      host,
    });

    d.on('connect', () => {
      console.log('Connected to AWS IoT Core');


      const payload = JSON.stringify({ message });

      d.publish(topic, payload);
      resolve()
    });

    d.on('error', (err) => {
      console.error(err);
      reject(err)
    });

    setTimeout(() => {
      d.publish(topic, "test");
    }, 5000);

    setTimeout(() => {
      reject(new Error("Timeout"))
    }, 10000);
  });

}