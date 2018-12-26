(function() {
  function Tab(options) {
    this.cfg = {
      tabSelector: options.tabSelector || '.chat-aside',
      activeHeaderItem: options.activeHeaderItem || 0
    }

    var tab = COMMON.qS(this.cfg.tabSelector)

    this.header = tab.querySelectorAll('.tag-header-item')
    this.body = tab.querySelectorAll('.tag-body-content')
    this.tagHeader = tab.querySelector('.tag-header-wrapper')

    this.active(this.cfg.activeHeaderItem)
    this.bindEvent()
  }

  Tab.prototype = {
    active: function(activeItem) {
      var currentItem = this.currentItem

      if (currentItem === activeItem) return

      if (currentItem !== undefined) {
        this.header[currentItem].classList.remove('tag-current')
        this.body[currentItem].classList.add('hidden')
      }

      this.header[activeItem].classList.add('tag-current')
      this.body[activeItem].classList.remove('hidden')

      this.currentItem = activeItem
    },
    bindEvent: function() {
      var self = this

      this.tagHeader.addEventListener('click', function(e) {
        var path = e.path

        for (var i = 0, len = path.length; i < len; i++) {
          if (path[i].classList.contains('tag-header-item')) {
            self.active([].slice.call(self.header).indexOf(path[i]))
            break
          }
        }
      }, false)
    }
  }

  function createTab() {
    new Tab({})
  }

  function init() {
    createTab()
  }

  init()
})()