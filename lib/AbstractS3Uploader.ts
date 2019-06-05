import { S3 as S3Client } from 'aws-sdk'
import { promisify } from 'util'

import { getName } from './helpers/getName'
import { S3Uploader } from './S3Uploader'

export class AbstractS3Uploader implements S3Uploader {
  private readonly s3Upload: (
    data: S3Client.PutObjectRequest,
  ) => Promise<S3Client.ManagedUpload.SendData>

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    endpoint: string,
    private readonly bucketName: string,
  ) {
    const s3Client = new S3Client({
      accessKeyId,
      secretAccessKey,
      endpoint,
    })

    this.s3Upload = promisify(s3Client.upload).bind(s3Client)
  }

  public upload = async (
    data: Buffer,
    originalName: string,
    publicAccess: boolean = true,
    useOriginalName: boolean = false,
  ) => {
    const params = {
      Bucket: this.bucketName,
      Key: getName(data, originalName, useOriginalName),
      Body: data,
      ACL: publicAccess ? 'public-read' : undefined,
    }

    const uploaded = await this.s3Upload(params)

    return uploaded.Location
  }
}
