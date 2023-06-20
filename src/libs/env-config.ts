const config: any = { region: "eu-central-1" };
if (process.env.STAGE === 'dev') {
    config.accessKeyId = process.env.DYNAMODB_LOCAL_ACCESS_KEY_ID;
    config.secretAccessKey = process.env.DYNAMODB_LOCAL_SECRET_ACCESS_KEY;
    config.endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
}

export default config;
