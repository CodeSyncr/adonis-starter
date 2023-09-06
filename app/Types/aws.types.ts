export interface AWSGetObjectParam {
  prefix?: string
  delimination?: string
}

export interface PresignParam {
  target: string
  fileExtension: string
  file_name?: string
  file_type?: string
  time: number
}

export interface PresignResponse {
  pre_signed_url: string
  path: string
  method: string
  bucket: string
  region: string
  url: string
  is_public: boolean
}
