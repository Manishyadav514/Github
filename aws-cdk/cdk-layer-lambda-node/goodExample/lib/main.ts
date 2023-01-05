#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CdkLayerLambdaStack } from './stacks/cdkLayerLambdaStack'

// Your AWS ID goes here.
const devEnv = {
  account: '217129141064',
  region: 'ap-south-1',
  }

const app = new cdk.App();
new CdkLayerLambdaStack(app, 'CdkLayerLambdaStack', { env: devEnv } )