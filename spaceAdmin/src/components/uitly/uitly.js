class Uitly {
  // 设置cookie
  setCookie (cname, cvalue, exdays = 1) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toGMTString()
    document.cookie = cname + '=' + cvalue + '; ' + expires
  }
  // 获取cookie
  getCookie (cname) {
    var name = cname + '='
    var ca = document.cookie.split(';')
    for (let c of ca) {
      c = c.trim()
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
    }
    return ''
  }

  // 删除cookie
  removeCookie (cname) {
    var d = new Date()
    d.setTime(d.getTime() - 1)
    var expires = 'expires=' + d.toGMTString()
    document.cookie = cname + '= ; ' + expires
  }
}
const uitly = new Uitly()
export default uitly
