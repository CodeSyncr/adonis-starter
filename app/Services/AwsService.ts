import SystemHelper from 'App/Utils/SystemHelper'
import { S3UploadPathTarget } from 'Contracts/enum'
import AWS from 'aws-sdk'
import AwsConfig from 'Config/aws'
import { AWSGetObjectParam, PresignParam, PresignResponse } from 'App/Types/aws.types'

export default class AwsService {
  constructor(private config: typeof AwsConfig) {
    AWS.config.update({
      accessKeyId: config.access_key,
      secretAccessKey: config.access_secret,
      region: config.region,
      signatureVersion: config.signature_version,
    })
    this.bucket = config.bucket
    this.region = config.region
    this.s3 = new AWS.S3()
  }

  private bucket: string
  private region: string
  private s3: AWS.S3

  public createFolder(folder_name: string, target: string): Promise<object> {
    try {
      const key = `${target}${folder_name}${folder_name.endsWith('/') ? '' : '/'}`
      return this.s3
        .putObject({
          Key: key,
          Bucket: this.bucket,
        })
        .promise()
    } catch (error) {
      throw {
        message: 'AWS Service error :: getS3Objects.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async deleteFile(target: string): Promise<object> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: target,
        })
        .promise()
      return { message: 'Resorce Deleted Successfully!' }
    } catch (error) {
      throw {
        message: 'AWS Service error :: getS3Objects.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async renameFile(oldTarget: string, newTarget: string): Promise<object> {
    try {
      const resp = await this.s3
        .copyObject({
          Bucket: this.bucket,
          CopySource: `${this.bucket}/${oldTarget}`,
          Key: newTarget,
          ACL: 'public-read',
        })
        .promise()
      await this.deleteFile(oldTarget)
      return { message: 'Filename Changed Successfully!', description: resp }
    } catch (error) {
      throw {
        message: 'AWS Service error :: getS3Objects.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async getS3Objects(target: AWSGetObjectParam) {
    try {
      const listObjectRequest: any = await this.s3
        .listObjectsV2({
          Bucket: this.bucket,
          Delimiter: target.delimination,
          Prefix: target.prefix,
        })
        .promise()
      console.log('listObjectRequest ::', listObjectRequest)
      if (listObjectRequest.Contents && listObjectRequest.Contents.length > 0) {
        const fileObjArr: any[] = []

        // fileObj: S3.ObjectList
        listObjectRequest.Contents.forEach(async (fileObj: any) => {
          if (fileObj.Size > 0) {
            const fileNameArr: Array<string> = fileObj.Key.split('/')
            const tempFileName: Array<string> = fileNameArr.slice(-1)
            const extensionArr: Array<string> = tempFileName[0].split('.')
            const extension: string = extensionArr[1]
            const fileName: string = extensionArr[0]
            fileObjArr.push({
              ...fileObj,
              location: `https://s3.${this.region}.amazonaws.com/${this.bucket}/${fileObj.Key}`,
              fileName,
              mimeType: extension || null,
            })
          }
        })
        listObjectRequest.Contents = fileObjArr
      }

      return listObjectRequest
    } catch (error) {
      throw {
        message: 'AWS Service error :: getS3Objects.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async preSignedUrlPublic({
    target,
    fileExtension,
    time = 600 * 5,
    file_name,
    file_type,
  }: PresignParam): Promise<PresignResponse> {
    return new Promise((resolve, reject) => {
      if (!file_name) {
        file_name = `${SystemHelper.newGuid()}.${fileExtension}`
      }

      if (!file_type) {
        file_type = 'application/octet-stream'
      }
      const key: string = `${target}${file_name}`
      const preSignedUrl: string = this.s3.getSignedUrl('putObject', {
        Key: key,
        Bucket: this.bucket,
        Expires: time,
        ACL: 'public-read',
        ContentType: file_type,
      })

      resolve({
        pre_signed_url: preSignedUrl,
        method: 'put',
        path: key,
        bucket: this.bucket,
        region: this.region,
        url: `https://s3.${this.region}.amazonaws.com/${this.bucket}/${key}`,
        is_public: true,
      })
    })
  }

  public async getS3Url(
    fileData: any,
    fileTypes: string[],
    fileTargetPath: S3UploadPathTarget,
    maxFileSize: number = 2,
    contentDisposition: string = 'inline'
  ): Promise<string> {
    // upload to s3
    const uploadObject: AWS.S3.Types.PutObjectRequest = {
      Bucket: this.bucket,
      Key: `${fileTargetPath}/${SystemHelper.newGuid()}.pdf}`,
      Body: fileData,
      ContentType: 'application/pdf',
      ACL: 'public-read',
      ContentDisposition: contentDisposition,
    }

    let s3response: AWS.S3.ManagedUpload.SendData = { Location: '', ETag: '', Bucket: '', Key: '' }
    try {
      s3response = await this.s3.upload(uploadObject).promise()
      return s3response.Location
    } catch (error) {
      throw {
        message: 'AWS Service error :: getS3Url.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async createMultipartUpload(fileName: string) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: String(fileName),
        ACL: 'public-read',
      }

      return await this.s3.createMultipartUpload(params).promise()
    } catch (error) {
      throw {
        message: 'AWS Service error :: createMultipartUpload.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async uploadPart(fileName: string, uploadId: string, partNumber: number) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: String(fileName),
        UploadId: uploadId,
        PartNumber: partNumber,
        // Body: body.file,
      }

      return await this.s3.uploadPart(params).promise()
    } catch (error) {
      throw {
        message: 'AWS Service error :: uploadPart.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async completeMultiPart(fileName: string, uploadId: string, parts: any) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: String(fileName),
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      }

      return await this.s3.completeMultipartUpload(params).promise()
    } catch (error) {
      throw {
        message: 'AWS Service error :: completeMultiPart.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async getPreSignedUrlMultipart(fileName: string, uploadId: any, parts: any) {
    try {
      const multipartParams = {
        Bucket: this.bucket,
        Key: String(fileName),
        UploadId: uploadId,
      }
      const promises: any = []
      for (let index = 0; index < parts; index++) {
        promises.push(
          this.s3.getSignedUrlPromise('uploadPart', {
            ...multipartParams,
            PartNumber: index + 1,
          })
        )
      }
      const signedUrls = await Promise.all(promises)
      const partSignedUrlList = signedUrls.map((signedUrl, index) => {
        return {
          signedUrl: signedUrl,
          PartNumber: index + 1,
        }
      })

      return {
        parts: partSignedUrlList,
      }
    } catch (error) {
      throw {
        message: 'AWS Service error :: getPreSignedUrl.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async abortMultiPart(fileName: string, uploadId: string) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: String(fileName),
        UploadId: uploadId,
      }

      return await this.s3.abortMultipartUpload(params).promise()
    } catch (error) {
      throw {
        message: 'AWS Service error :: abortMultiPart.',
        errors: [{ code: 'E_FAILED', stack: error }],
      }
    }
  }

  public async signedUrl({ filePath, time = 600 * 5 }): Promise<string> {
    return this.s3.getSignedUrl('getObject', {
      Key: filePath,
      Bucket: this.bucket,
      Expires: time,
    })
  }
}
