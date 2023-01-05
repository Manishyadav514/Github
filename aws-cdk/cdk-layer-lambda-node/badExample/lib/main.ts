#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CdkLayerLambdaStack } from './stacks/badCdkLayerLambdaStack'

const devEnv = {
    account: '217129141064',
    region: 'ap-south-1',
  }

const app = new cdk.App();
new CdkLayerLambdaStack(app, 'BadLayerLambdaStack', { env: devEnv } )