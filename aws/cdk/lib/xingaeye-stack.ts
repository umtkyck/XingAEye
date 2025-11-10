import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iot from 'aws-cdk-lib/aws-iot'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class XingAEyeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // DynamoDB Tables
    const devicesTable = new dynamodb.Table(this, 'DevicesTable', {
      tableName: 'xingaeye-devices',
      partitionKey: { name: 'deviceId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const crossingsTable = new dynamodb.Table(this, 'CrossingsTable', {
      tableName: 'xingaeye-crossings',
      partitionKey: { name: 'crossingId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const alertsTable = new dynamodb.Table(this, 'AlertsTable', {
      tableName: 'xingaeye-alerts',
      partitionKey: { name: 'alertId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    })

    alertsTable.addGlobalSecondaryIndex({
      indexName: 'CrossingIndex',
      partitionKey: { name: 'crossingId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    })

    const videosTable = new dynamodb.Table(this, 'VideosTable', {
      tableName: 'xingaeye-videos',
      partitionKey: { name: 'videoId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'xingaeye-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // S3 Bucket for videos
    const videosBucket = new s3.Bucket(this, 'VideosBucket', {
      bucketName: 'xingaeye-videos',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [
        {
          id: 'DeleteOldVideos',
          enabled: true,
          expiration: cdk.Duration.days(30),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(7),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(14),
            },
          ],
        },
      ],
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    })

    // IoT Topic Rule for device messages
    const deviceMessageRule = new iot.CfnTopicRule(this, 'DeviceMessageRule', {
      topicRulePayload: {
        sql: "SELECT * FROM 'device/+/telemetry'",
        actions: [
          {
            dynamoDBv2: {
              roleArn: '', // Add role ARN
              putItem: {
                tableName: devicesTable.tableName,
              },
            },
          },
        ],
        ruleDisabled: false,
      },
    })

    // Lambda function for alert processing
    const alertProcessorLambda = new lambda.Function(this, 'AlertProcessor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambda/alert-processor'),
      handler: 'index.handler',
      environment: {
        ALERTS_TABLE: alertsTable.tableName,
        DEVICES_TABLE: devicesTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    })

    // Grant permissions
    alertsTable.grantReadWriteData(alertProcessorLambda)
    devicesTable.grantReadData(alertProcessorLambda)

    // API Gateway (optional, if not using separate backend)
    // const api = new apigateway.RestApi(this, 'XingAEyeAPI', {
    //   restApiName: 'XingAEye API',
    //   description: 'API for XingAEye railroad crossing monitoring',
    // })

    // Outputs
    new cdk.CfnOutput(this, 'DevicesTableName', {
      value: devicesTable.tableName,
      description: 'Devices DynamoDB Table Name',
    })

    new cdk.CfnOutput(this, 'VideosBucketName', {
      value: videosBucket.bucketName,
      description: 'Videos S3 Bucket Name',
    })

    new cdk.CfnOutput(this, 'AlertsTableName', {
      value: alertsTable.tableName,
      description: 'Alerts DynamoDB Table Name',
    })
  }
}
