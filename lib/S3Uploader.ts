export interface S3Uploader {
  upload(
    data: Buffer,
    originalName: string,
    publicAccess?: boolean,
  ): Promise<string>
}
