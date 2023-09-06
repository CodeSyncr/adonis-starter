import Env from '@ioc:Adonis/Core/Env'

const AwsConfig = {
  access_key: Env.get('S3_KEY'),
  access_secret: Env.get('S3_SECRET'),
  region: Env.get('S3_REGION'),
  signature_version: 'v4',
  bucket: Env.get('S3_BUCKET'),
}

export default AwsConfig
