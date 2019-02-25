import { AbstractS3Uploader } from './AbstractS3Uploader'

const getEndpoint = (region: string) =>
  `https://${region}.digitaloceanspaces.com`

export class DigitalOceanUploader extends AbstractS3Uploader {
  public constructor(
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
    bucket: string,
  ) {
    super(accessKeyId, secretAccessKey, getEndpoint(region), bucket)
  }
}
