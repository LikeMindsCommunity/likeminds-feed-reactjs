/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  PutObjectCommand,
  PutObjectOutput,
  PutObjectRequest,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { LMAppAwsKeys } from "./constants/lmAppAwsKeys";
export class HelperFunctionsClass {
  static detectLinks(text: string) {
    const regex = /\b(?:https?:\/\/)?(?:[\w.]+\.\w+)(?:(?<=\\n)|\b)/g;
    const links = text?.match(regex);
    return links ? links : [];
  }

  static parseDataLayerResponse(response: any) {
    return {
      ...response,
    };
  }

  logError(err: any) {
    if (process.env.NODE_ENV === "development") {
      console.log(`%c `, 'background: #222; color: "white";');
    }
  }

  static getAWS(): S3Client {
    const credentials = fromCognitoIdentityPool({
      identityPoolId: LMAppAwsKeys.identityPoolId,
      clientConfig: {
        region: LMAppAwsKeys.region,
      },
    });

    const s3Client = new S3Client({ region: LMAppAwsKeys.region, credentials });
    return s3Client;
  }

  static async uploadMedia(
    media: File,
    userUniqueId: string,
  ): Promise<PutObjectOutput> {
    const s3Client = this.getAWS();
    const { Key, Bucket, Body, ACL, ContentType } = this.buildUploadParams(
      media,
      userUniqueId,
    );
    const command = new PutObjectCommand({
      Key,
      Bucket,
      Body,
      ACL,
      ContentType,
    });
    return s3Client.send(command);
  }

  private static buildUploadParams(
    media: File,
    userUniqueId: string,
  ): PutObjectRequest {
    return {
      Key: `files/post/${userUniqueId}/${media.name}`,
      Bucket: LMAppAwsKeys.bucketName,
      Body: media,
      ACL: "public-read-write",
      ContentType: media.type,
    };
  }
}
