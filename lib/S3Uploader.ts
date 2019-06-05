export interface S3Uploader {
  upload(
    data: Buffer,
    originalName: string,
    publicAccess?: boolean,
    useOriginalName?: boolean,
  ): Promise<string>
}
