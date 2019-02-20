import { S3Uploader } from './S3Uploader'

const getEndpoint = (region: string) =>
  `https://${region}.digitaloceanspaces.com`

export class DigitalOceanOploader extends S3Uploader {
  public constructor(
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
    bucket: string,
  ) {
    super(accessKeyId, secretAccessKey, getEndpoint(region), bucket)
  }
}
