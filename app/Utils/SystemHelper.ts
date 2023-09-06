import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default class SystemHelper {
  public static newGuid(): string {
    return uuidv4()
  }

  public static formatDate = (date: any) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return day + '-' + month + '-' + year
  }

  public static formatCurrency = (cents: any) => {
    return cents.toFixed(2)
  }

  public static getDataUri = async (url: string) => {
    const image = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    return image.data
  }

  public static getAddress = (userData: any) => {
    const addressLine1 = userData.addressLine1 + ' ' ?? ''
    const addressLine2 = userData.addressLine2 ?? ''

    return addressLine1 + addressLine2
  }

  public static getAddressHeader = (userData: any) => {
    const addressCity = userData.city + ', ' ?? ''
    const addressState = userData.state + ' - ' ?? ''
    const addressPincode = userData.pin_code ?? ''

    return addressCity + addressState + addressPincode
  }

  public static generateURI = (keyValue: string) =>
    `https://${process.env.ARK_AWS_S3_IMAGES_BUCKET}.s3.${process.env.ARK_AWS_REGION}.amazonaws.com/${keyValue}`

  //   public static getFcmTokenByUser = async (email: string) => {
  //     const fcmResponse = await axios.get(strapiEndpoints.getFcmTokenByUserEmail(email), {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
  //       },
  //     })
  //     if (
  //       fcmResponse.status === 200 &&
  //       fcmResponse.data &&
  //       fcmResponse.data.data &&
  //       fcmResponse.data.data.length > 0
  //     ) {
  //       return fcmResponse.data.data[0].attributes
  //     } else {
  //       return null
  //     }
  //   }
}
