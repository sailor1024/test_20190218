export function setCookie (cName, value, expiretiemr) {
  let timer = new Date().getTime()
  const exdate = new Date(timer + expiretiemr)
  document.cookie = cName + '=' + escape(value) +
  ((expiretiemr == null) ? '' : ';expires=' + exdate.toGMTString())
}

export function getCookie (cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

export function removeCookie () {
  const keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (let i = 0; i < keys.length; i++) { document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }
  }
}

export const toDate = function (date) {
  let _date = new Date(date)
  // IE patch start
  if (isNaN(_date.getTime()) && typeof date === 'string') {
    _date = date.split('-').map(Number)
    _date[1] += 1
    _date = new Date(..._date)
  }
  // IE patch end

  if (isNaN(_date.getTime())) return null
  return _date
}

const formatter = function (dateObj, mask) {
  const token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g
  const masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss',
    shortDate: 'M/D/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'dddd, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS',
    chineseTime: 'yyyy年MM月dd日'
  }
  const formatFlags = {
    D: function (dateObj) {
      return dateObj.getDay()
    },
    DD: function (dateObj) {
      return pad(dateObj.getDay())
    },
    d: function (dateObj) {
      return dateObj.getDate()
    },
    dd: function (dateObj) {
      return pad(dateObj.getDate())
    },
    M: function (dateObj) {
      return dateObj.getMonth() + 1
    },
    MM: function (dateObj) {
      return pad(dateObj.getMonth() + 1)
    },
    yy: function (dateObj) {
      return String(dateObj.getFullYear()).substr(2)
    },
    yyyy: function (dateObj) {
      return dateObj.getFullYear()
    },
    h: function (dateObj) {
      return dateObj.getHours() % 12 || 12
    },
    hh: function (dateObj) {
      return pad(dateObj.getHours() % 12 || 12)
    },
    H: function (dateObj) {
      return dateObj.getHours()
    },
    HH: function (dateObj) {
      return pad(dateObj.getHours())
    },
    m: function (dateObj) {
      return dateObj.getMinutes()
    },
    mm: function (dateObj) {
      return pad(dateObj.getMinutes())
    },
    s: function (dateObj) {
      return dateObj.getSeconds()
    },
    ss: function (dateObj) {
      return pad(dateObj.getSeconds())
    },
    S: function (dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100)
    },
    SS: function (dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2)
    },
    SSS: function (dateObj) {
      return pad(dateObj.getMilliseconds(), 3)
    },
    ZZ: function (dateObj) {
      var o = dateObj.getTimezoneOffset()
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
    }
  }
  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj)
  }

  if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date in fecha.format')
  }

  mask = masks[mask] || mask || masks['default']

  return mask.replace(token, function ($0) {
    return $0 in formatFlags ? formatFlags[$0](dateObj) : $0.slice(1, $0.length - 1)
  })
}
/**
 * 时间格式化
 * @param {String|Timestap} date 需要转化的时间
 * @param {String} format 时间格式. eg: 'yyyy/MM-dd' 2018/11-11
 */
export const formatDate = function (date, format) {
  date = toDate(date)
  if (!date) return ''
  return formatter(date, format || 'yyyy-MM-dd')
}

function pad (val, len) {
  val = String(val)
  len = len || 2
  while (val.length < len) {
    val = '0' + val
  }
  return val
}
