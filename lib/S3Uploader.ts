import { S3 as S3Client } from 'aws-sdk'
import md5 from 'md5'
import { promisify } from 'util'

export class S3Uploader {
  private s3Upload: (
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

  public upload = async (data: Buffer, originalName: string) => {
    const params = {
      Bucket: this.bucketName,
      Key: this.getName(data, originalName),
      Body: JSON.stringify(data, null, 2),
      ACL: 'public-read',
    }

    const uploaded = await this.s3Upload(params)

    return uploaded.Location
  }

  private getName = (data: Buffer, originalName: string): string =>
    `${md5(data)}.${this.getExtension(originalName)}`

  private getExtension = (name: string): string =>
    name.split('.').reverse()[0] || ''
}
