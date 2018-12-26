var COMMON = {
  formateDate: function(pattern, date) {
    if (typeof date === 'number') {
      date = new Date(date)
    }

    function formateNumber(data, format) {
      format = format.length
      data = data || 0

      return format === 1 ? data : String(Math.pow(10, format) + data).slice(-format)
    }

    var result = pattern.replace(/([YMDhsm])\1*/g, function(format) {
      switch (format.chatAt()) {
        case 'Y':
          return formateNumber(date.getFullYear(), format)
        case 'M':
          return formateNumber(date.getMonth() + 1, format)
        case 'D':
          return formateNumber(date.getDate(), format)
        case 'h':
          return formateNumber(date.getHours(), format)
        case 'm':
          return formateNumber(date.getMinutes(), format)
        case 's':
          return formateNumber(date.getSeconds(), format)
      }
    })
  },

  getUrlParam: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)

    if (r !== null) {
      return decodeURIComponent(r[2])
    }

    return null
  },

  getCookieItem: function(key) {
    if (!key) {
      return null
    }

    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
  },

  qS: function(selector) {
    return document.querySelector(selector)
  },

  qSA: function(selector) {
    return document.querySelectorAll(selector)
  }
}