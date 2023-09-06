export default class ChangeCase {
  public static toTitle(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  public static variableCase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1)
  }

  public static toUpper(str) {
    return str.toUpperCase()
  }

  public static toLower(str) {
    return str.toLowerCase()
  }
}
