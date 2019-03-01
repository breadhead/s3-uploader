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
  ) => {
    const fileName = getName(data, originalName)

    const bucketExist = await this.s3Client.bucketExists(this.bucketName)

    if (!bucketExist) {
      await this.s3Client.makeBucket(this.bucketName, 'default')
    }

    await this.s3Client.putObject(this.bucketName, fileName, data)

    if (publicAccess) {
      const oldPolicy = await this.s3Client
        .getBucketPolicy(this.bucketName)
        .catch(this.createEmptyPolicy)
      const newPolicy = this.addNewFileToPolicy(oldPolicy, fileName)
      await this.s3Client.setBucketPolicy(this.bucketName, newPolicy)
    }

    return `${this.endpoint}/${this.bucketName}/${fileName}`
  }

  private addNewFileToPolicy = (
    policyString: string,
    fileName: string,
  ): string => {
    const oldPolicy = JSON.parse(policyString)

    const resource = `arn:aws:s3:::${this.bucketName}/${fileName}`

    const oldStatement = oldPolicy.Statement.filter(
      statement => !statement.Resource.includes(resource),
    )

    const policy = {
      ...oldPolicy,
      Statement: [
        ...oldStatement,
        {
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Resource: [resource],
          Sid: 'Public',
        },
      ],
    }

    return JSON.stringify(policy)
  }

  private createEmptyPolicy = () =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [],
    })
}
