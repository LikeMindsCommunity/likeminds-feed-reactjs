import { S3Client, PutObjectOutput } from "@aws-sdk/client-s3";
export declare class HelperFunctionsClass {
    static detectLinks(text: string): never[] | RegExpMatchArray;
    static parseDataLayerResponse(response: any): any;
    logError(err: any): void;
    static getAWS(): S3Client;
    static uploadMedia(media: File, userUniqueId: string): Promise<PutObjectOutput>;
    private static buildUploadParams;
}
