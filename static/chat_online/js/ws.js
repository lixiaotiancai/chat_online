(function() {
  var ws_url = 'ws://localhost:3000/chat_online?' + 'username=' + COMMON.getCookieItem('username')
  var ws = new WebSocket(ws_url)

  ws.onopen = function() {
    COMMON.qS('.input-send-btn').addEventListener('click', function() {
      var option = {
        type: 'chat_message',
        content: {
          username: decodeURIComponent(COMMON.getCookieItem('username')),
          message: COMMON.qS('.input-area').textContent
        }
      }

      ws.send(JSON.stringify(option))

      COMMON.qS('.input-area').textContent = ""
    })

    COMMON.qS('.input-area').addEventListener('keyup', function(e) {
      if (e.keyCode === 13) {
        var option = {
          type: 'chat_message',
          content: {
            username: decodeURIComponent(COMMON.getCookieItem('username')),
            message: COMMON.qS('.input-area').textContent
          }
        }

        ws.send(JSON.stringify(option))

        COMMON.qS('.input-area').textContent = ""
      }
    })

    COMMON.qS('.input-area').addEventListener('keydown', function(e) {
      if (e.altKey && e.keyCode === 83) {
        var option = {
          type: 'chat_message',
          content: {
            username: decodeURIComponent(COMMON.getCookieItem('username')),
            message: COMMON.qS('.input-area').textContent
          }
        }

        ws.send(JSON.stringify(option))

        COMMON.qS('.input-area').textContent = ""
      }
    })
  }

  ws.onmessage = function(e) {
    var data = JSON.parse(e.data)

    switch (data.type) {
      case 'chat_message':
        addMessage(data.content)
        break
      case 'log_message':
        addLogMessage(data.content)
        break
      case 'user_online_response':
        changeOnlineStatus(data.content)
        break
      case 'notify_publish':
        showNotify(data.content)
        break
    }
  }

  function addMessage(content) {
    var message_html = '' +
      '<div class="message">' +
      '<div class="message-username">' +
      content.username +
      '</div>' +
      '<div class="message-content">' +
      content.message +
      '</div>' +
      '</div>'

    var message_wrapper = document.createElement('div')

    message_wrapper.classList.add('message-wrapper')
    message_wrapper.innerHTML = message_html
    COMMON.qS('.chat-view').appendChild(message_wrapper)
  }

  function addLogMessage(content) {
    var log_message_html = '' +
      '<div class="log-message">' +
      content.message +
      '</div>'

    var log_message_wrapper = document.createElement('div')

    log_message_wrapper.classList.add('log-message-wrapper')
    log_message_wrapper.innerHTML = log_message_html
    COMMON.qS('.chat-view').appendChild(log_message_wrapper)
  }

  function changeOnlineStatus(content) {
    var userlist = content.userlist
    var useronline = content.useronline

    var user_online_html = ''

    var user_online_container = document.createElement('div')

    user_online_container.classList.add('user-online-container')

    userlist.forEach(function(username) {
      if (username === 'null') {
        username = "游客"
      }

      user_online_html = '' +
        '<div class="user-online-username">' +
        username +
        '</div>'

      user_online_container.innerHTML += user_online_html
    })


    COMMON.qS('.online.tag-body-content').innerHTML = ''
    COMMON.qS('.online.tag-body-content').appendChild(user_online_container)

    COMMON.qS('.online.header-item-content').innerHTML = content.useronline
  }

  function showNotify(content) {
    var title = content.title
    var content = content.content

    var notify_html = '' +
      '<div class="publish-container">' +
      '<div class="publish-dialog">' +
      '<div class="publish-header">' +
      '<h2 class="publish-title">系统公告</h2>' +
      '<div class="publish-close">x</div>' +
      '</div>' +
      '<div class="publish-main-wrapper">' +
      '<div class="publish-main">' +
      '<div class="publish-input-container">' +
      '<div class="publish-input-title" type="text" placeholder="请输入标题">' +
      title +
      '</div>' +
      '<div class="publish-input-content">' +
      content +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'

    var notify_panel = document.createElement('div')

    notify_panel.classList.add('bg-panel')
    notify_panel.innerHTML = notify_html

    if (COMMON.qS('.bg-panel')) {
      var panel = COMMON.qS('.bg-panel')
      panel.parentNode.removeChild(panel)
    }

    COMMON.qS('.chat-container').appendChild(notify_panel)
  }

  window.ws = ws
})()