#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { XingAEyeStack } from '../lib/xingaeye-stack'

const app = new cdk.App()

new XingAEyeStack(app, 'XingAEyeStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'XingAEye Railroad Crossing Safety System Infrastructure',
})

app.synth()
