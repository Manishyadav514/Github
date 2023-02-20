import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
export class CdkLayerExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdalayer = new lambda.LayerVersion(this, "LayerExample", {
      layerVersionName: "TsCdkLayerExample",
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      code: lambda.Code.fromAsset("./dist/layer"),
      compatibleArchitectures: [lambda.Architecture.X86_64],
    });

    new cdk.CfnOutput(this, "lambdalayer", {
      value: lambdalayer.layerVersionArn,
      exportName: `lambdalayer`,
    });
  }
}
