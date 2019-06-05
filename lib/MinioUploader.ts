import { Client as S3Client } from 'minio'

import { getName } from './helpers/getName'
import { S3Uploader } from './S3Uploader'

export class MinioUploader implements S3Uploader {
  private readonly s3Client: S3Client

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    private readonly endpoint: string,
    private readonly bucketName: string,
    useSSL: boolean = false,
  ) {
    const [port, ...endPointPieces] = endpoint.split(':').reverse()

    this.s3Client = new S3Client({
      endPoint: endPointPieces.reverse().join(':'),
      port: parseInt(port, 10),
      useSSL,
      accessKey: accessKeyId,
      secretKey: secretAccessKey,
    })
  }

  public upload = async (
    data: Buffer,
    originalName: string,
    publicAccess: boolean = true,
    useOriginalName: boolean = false,
  ) => {
    const fileName = getName(data, originalName, useOriginalName)

    const bucketExist = await this.s3Client.bucketExists(this.bucketName)

    if (!bucketExist) {
      await this.s3Client.makeBucket(this.bucketName, 'default')
    }

    await this.s3Client.putObject(this.bucketName, fileName, data)

    if (publicAccess) {
      await this.s3Client.setBucketPolicy(
        this.bucketName,
        this.createEmptyPolicy(this.bucketName),
      )
    }

    return `${this.endpoint}/${this.bucketName}/${fileName}`
  }

  private createEmptyPolicy = bucketName =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'Public',
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    })
}
