(function() {
  function Client(opt) {
    // util
    var T = {
      merge: function(targetObj, mergeObj) {
        for (var key in mergeObj) {
          targetObj[key] = mergeObj[key]
        }
        return targetObj
      },

      qS: function(selector, ctx) {
        return ctx.querySelector(selector)
      }
    }

    var config = {
      support: '' // PC or Mobile
    }

    var option = this.option = T.merge(config, opt)

    this.insertBody = T.qS('body', document)
    this.insertNode = T.qS('header', document)

    this.showPanel(option.support)
    this.bindEvent()
  }

  Client.prototype.createInsertNode = function() {
    var div = document.createElement('div')
    div.classList.add('client-support-panel')

    this.insertBody.insertBefore(div, this.insertNode)
    this.clientPanel = this.insertBody.querySelector('.client-support-panel')
  }

  Client.prototype.showPanel = function(support) {
    var mobile = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"]
    var userInfo = window.navigator.userAgent
    var client = 'PC'
    var len = mobile.length

    for (var i = 0; i < len; i++) {
      if (userInfo.indexOf(mobile[i]) > 0) {
        client = 'Mobile'
        break
      }
    }

    if (client !== support) {
      var supportText = support === 'PC' ? '该页面暂时只支持PC端访问' : '该页面暂时只支持移动端访问'
      var insertHTML = '' +
        '<div class="client-support-text">' +
        supportText +
        '</div>' +
        '<div class="client-support-close">' +
        'x' +
        '</div>'

      this.createInsertNode()
      this.clientPanel.innerHTML = insertHTML
    }
  }

  Client.prototype.bindEvent = function() {
    var self = this
    var closeBtn = document.querySelector('.client-support-close')
    closeBtn && closeBtn.addEventListener('click', function() {
      self.clientPanel.classList.add('client-support-hide')
    }, false)
  }

  window.__CLIENT__ = Client
})()