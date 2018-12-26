(function() {
  window.userinfo = {}

  function getUserInfo() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)

        window.userinfo = data

        if (data.is_login) {
          var username = data.username
          var input_area_disable_panel = COMMON.qS('.input-area-disable-panel')

          COMMON.qS('.current-user-name').innerText = username
          COMMON.qS('.unlogin-user-wrapper').classList.add('hidden')
          COMMON.qS('.current-user-wrapper').classList.remove('hidden')
          COMMON.qS('.notify-link-wrapper').classList.remove('hidden')

          input_area_disable_panel.parentNode.removeChild(input_area_disable_panel)
        }
      }
    }

    xhr.open('GET', 'chat_online/api/get_userInfo')

    xhr.send(null)
  }

  function getSystemSignUser() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var userList = JSON.parse(xhr.responseText).user
        showSignUser(userList)
      }
    }

    xhr.open('GET', 'chat_online/api/get_system_user')

    xhr.send(null)
  }

  function ajaxLogin(username, password) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)
        if (data.success) {
          window.location.reload()
        } else {
          console.log(data)
        }
      }
    }

    xhr.open('POST', 'chat_online/api/login')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('username=' + username + '&password=' + password)
  }

  function ajaxSign(username, password) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)
        if (data.success) {
          ajaxLogin(username, password)
        } else {
          console.log(data)
        }
      }
    }

    xhr.open('POST', 'chat_online/api/sign')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('username=' + username + '&password=' + password)
  }

  function ajaxLogout() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)
        if (data.success) {
          window.location.reload()
        } else {
          console.log(data.message)
        }
      }
    }

    xhr.open('POST', 'chat_online/api/logout')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send(null)
  }

  function showSignUser(userList) {
    var usernum = userList.length

    var user_sign_html = ''

    var user_sign_container = document.createElement('div')

    user_sign_container.classList.add('user-sign-container')

    userList.forEach(function(item) {
      user_sign_html = '' +
        '<div class="user-sign-username">' +
        item.username +
        '</div>'

      user_sign_container.innerHTML += user_sign_html
    })

    COMMON.qS('.sign.tag-body-content').innerHTML = ''
    COMMON.qS('.sign.tag-body-content').appendChild(user_sign_container)
    COMMON.qS('.sign.header-item-content').innerHTML = usernum
  }

  function showLoginPanel() {
    var login_dialog_panel_html = '' +
      '<div class="login-dialog-container">' +
      '<div class="login-dialog">' +
      '<div class="login-header">' +
      '<h2 class="login-title">登录</h2>' +
      '<div class="login-close">x</div>' +
      '</div>' +
      '<div class="login-main-wrapper">' +
      '<div class="login-main">' +
      '<div class="login-input-container">' +
      '<input class="login-input-username" type="text" placeholder="请输入用户名" />' +
      '<input class="login-input-password" type="password" placeholder="请输入密码" />' +
      '</div>' +
      '<a href="javascript:void(0)">注册新用户</a>' +
      '<button id="js-login-btn" class="login-btn">登录</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="sign-dialog hidden">' +
      '<div class="login-header">' +
      '<h2 class="login-title">注册</h2>' +
      '<div class="login-close">x</div>' +
      '</div>' +
      '<div class="login-main-wrapper">' +
      '<div class="login-main">' +
      '<div class="login-input-container">' +
      '<input class="login-input-username" type="text" placeholder="请输入用户名" />' +
      '<input class="login-input-password" type="password" placeholder="请输入密码" />' +
      '<input class="login-input-password" type="password" placeholder="请确认密码" />' +
      '</div>' +
      '<a href="javascript:void(0)">返回登录</a>' +
      '<button id="js-sign-btn" class="login-btn">注册</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'

    var login_dialog_panel = document.createElement('div')

    login_dialog_panel.classList.add('bg-panel')
    login_dialog_panel.innerHTML = login_dialog_panel_html
    COMMON.qS('.chat-container').appendChild(login_dialog_panel)
  }

  function closePanel(selector) {
    var panel = COMMON.qS(selector)
    if (panel) {
      panel.parentNode.removeChild(panel)
    }
    panel = null
  }

  function showNotifyPublishPanel() {
    var notify_publish_html = '' +
      '<div class="publish-container">' +
      '<div class="publish-dialog">' +
      '<div class="publish-header">' +
      '<h2 class="publish-title">发布公告</h2>' +
      '<div class="publish-close">x</div>' +
      '</div>' +
      '<div class="publish-main-wrapper">' +
      '<div class="publish-main">' +
      '<div class="publish-input-container">' +
      '<input class="publish-input-title" type="text" placeholder="请输入标题" />' +
      '<div class="publish-input-content" contenteditable="true">' +
      '</div>' +
      '</div>' +
      '<button id="js-publish-btn" class="publish-btn">发布</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'

    var notify_publish_panel = document.createElement('div')

    notify_publish_panel.classList.add('bg-panel')
    notify_publish_panel.innerHTML = notify_publish_html
    COMMON.qS('.chat-container').appendChild(notify_publish_panel)
  }

  function bindEvents() {
    COMMON.qS('.user-login').addEventListener('click', function() {
      showLoginPanel()
    })

    COMMON.qS('.user-logout').addEventListener('click', function() {
      ajaxLogout()
    })

    COMMON.qS('.notify-link').addEventListener('click', function() {
      showNotifyPublishPanel()
    })

    COMMON.qS('.chat-container').addEventListener('click', function(e) {
      if (e.target.tagName.toUpperCase() === 'A' && e.target.textContent === '注册新用户') {
        COMMON.qS('.login-dialog').classList.add('hidden')
        COMMON.qS('.sign-dialog').classList.remove('hidden')
      }

      if (e.target.tagName.toUpperCase() === 'A' && e.target.textContent === '返回登录') {
        COMMON.qS('.login-dialog').classList.remove('hidden')
        COMMON.qS('.sign-dialog').classList.add('hidden')
      }

      if (e.target.tagName.toUpperCase() === 'DIV' && e.target.classList.contains('login-close')) {
        closePanel('.bg-panel')
      }

      if (e.target.tagName.toUpperCase() === 'DIV' && e.target.classList.contains('publish-close')) {
        closePanel('.bg-panel')
      }

      if (e.target.tagName.toUpperCase() === 'BUTTON' && e.target.id === 'js-login-btn') {
        var username = COMMON.qSA('.login-dialog input')[0].value
        var password = COMMON.qSA('.login-dialog input')[1].value

        ajaxLogin(username, password)
      }

      if (e.target.tagName.toUpperCase() === 'BUTTON' && e.target.id === 'js-sign-btn') {
        var username = COMMON.qSA('.sign-dialog input')[0].value
        var password = COMMON.qSA('.sign-dialog input')[1].value
        var password_repeat = COMMON.qSA('.sign-dialog input')[2].value

        ajaxSign(username, password)
      }

      if (e.target.tagName.toUpperCase() === 'BUTTON' && e.target.id === 'js-publish-btn') {
        var publish_title = COMMON.qS('.publish-dialog .publish-input-title').value
        var publish_content = COMMON.qS('.publish-dialog .publish-input-content').textContent

        var option = {
          type: 'notify_publish',
          content: {
            title: publish_title,
            content: publish_content
          }
        }

        ws.send(JSON.stringify(option))
        window.location.reload()
      }
    })
  }

  function init() {
    getUserInfo()
    getSystemSignUser()
    bindEvents()
  }

  init()
})()