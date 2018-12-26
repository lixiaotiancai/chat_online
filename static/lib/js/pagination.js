(function() {
  // util
  var T = {
    merge: function(targetObj, mergeObj) {
      for (var key in mergeObj) {
        targetObj[key] = mergeObj[key]
      }
      return targetObj
    },

    byId: function(id) {
      return document.getElementById(id)
    },

    qS: function(selector, ctx) {
      return ctx.querySelector(selector)
    },

    qSA: function(selector, ctx) {
      return [].slice.call(ctx.querySelectorAll(selector))
    }
  }

  function Pagination(opt) {
    var config = {
      id: '',
      item_per_page: 5, // 每页展示的条目数
      page_total: 10, // 页面总数
      page_show_count: 3, // 展示的连续页面
    }

    // show 正常展示并可用
    // active 当前活动页
    // disable 展示但不可用
    var nodeOption = {
      first: {
        show: {
          content: '<<'
        }
      },

      pre: {
        show: {
          content: '<'
        },
        disabled: {
          content: '<',
          style: 'pagination-item-disabled'
        }
      },

      num: {
        show: {
          content: ''
        },
        active: {
          content: '',
          style: 'pagination-item-active'
        }
      },

      ellipse: {
        show: {
          content: '...',
          style: 'pagination-item-disabled'
        }
      },

      next: {
        show: {
          content: '>'
        },
        disabled: {
          content: '>',
          style: 'pagination-item-disabled'
        }
      },

      last: {
        show: {
          content: '>>'
        }
      }
    }

    var nodeList = []

    var option = this.option = T.merge(config, opt)

    var pagination = this.pagination = T.byId(option.id)

    this.nodeOption = nodeOption
    this.nodeList = nodeList

    this.paginationUl = T.qS('.pagination-wrapper', pagination)

    var currentPage = this.currentPage = COMMON.getUrlParam('page') ? (COMMON.getUrlParam('page') - 1) : 0

    this.init(option.page_total, option.page_show_count, currentPage)

    this.bindEvent()
  }

  // 创建节点
  Pagination.prototype.createPaginationNode = function(total, count, active) {
    var isFirstShow = active > 0 // << show?
    var isLastShow = active < total - 1 // >> show?
    var isPreDisabled = active > 0 // < disabled?
    var isNextDisabled = active < total - 1 // > disabled?

    var leftBorder = active - Math.floor((count - 1) / 2)
    var rightBorder = active + Math.ceil((count - 1) / 2)
    var isLeftEllipseShow = leftBorder > 0 // left ... show?
    var isRightEllipseShow = rightBorder < total - 1 // right .. show?

    var startNum // start num
    var endNum // end num

    if (!isLeftEllipseShow && isRightEllipseShow) {
      startNum = 1
      endNum = count
    } else if (isLeftEllipseShow && isRightEllipseShow) {
      startNum = leftBorder + 1
      endNum = rightBorder + 1
    } else if (isLeftEllipseShow && !isRightEllipseShow) {
      startNum = total - count + 1
      endNum = total
    } else {
      console.log('config error...')
    }

    var nodeList = this.nodeList = []
    var nodeOption = this.nodeOption

    isFirstShow && nodeList.push(nodeOption.first.show)
    isPreDisabled ? nodeList.push(nodeOption.pre.show) : nodeList.push(nodeOption.pre.disabled)
    isLeftEllipseShow && nodeList.push(nodeOption.ellipse.show)

    for (var i = startNum; i <= endNum; i++) {
      if (i == active + 1) {
        nodeOption.num.active.content = i
        nodeList.push(nodeOption.num.active)
        continue
      }

      nodeOption.num.show.content = i
      nodeList.push(JSON.parse(JSON.stringify(nodeOption.num.show)))
    }

    isRightEllipseShow && nodeList.push(nodeOption.ellipse.show)
    isNextDisabled ? nodeList.push(nodeOption.next.show) : nodeList.push(nodeOption.next.disabled)
    isLastShow && nodeList.push(nodeOption.last.show)
  }

  // 渲染节点
  Pagination.prototype.renderPaginationNode = function() {
    var nodeList = this.nodeList
    var len = nodeList.length

    var nodeHTML = ''

    var fragment = document.createDocumentFragment()

    var paginationUl = this.paginationUl
    paginationUl.innerHTML = ''

    for (var i = 0; i < len; i++) {
      var li = document.createElement('li')

      li.classList.add('pagination-item')
      nodeList[i].style && li.classList.add(nodeList[i].style)

      var span = document.createElement('span')
      var textNode = document.createTextNode(nodeList[i].content)
      span.appendChild(textNode)

      li.appendChild(span)
      fragment.appendChild(li)
    }

    paginationUl.appendChild(fragment)
  }

  // init
  Pagination.prototype.init = function(total, count, active) {
    var current = +active

    // set currentPage
    this.pagination.setAttribute('current_page', current)
    // 创建节点
    this.createPaginationNode(total, count, active)
    // 渲染节点
    this.renderPaginationNode()
  }

  // page jump
  Pagination.prototype.jump = function(target) {
    var self = this

    var content = target.textContent

    var pagination = this.pagination
    var nodeOption = this.nodeOption
    var total = this.option.page_total
    var active = +pagination.getAttribute('current_page')

    if (+content) {
      if (+content !== active + 1) {
        window.location.href = '/blog?page=' + +content
      }
    }

    // <<
    if (content === nodeOption.first.show.content) {
      window.location.href = '/blog?page=' + 1
    }

    // <
    if (content === nodeOption.pre.show.content) {
      if (active > 0) {
        window.location.href = '/blog?page=' + active
      }
    }

    // >
    if (content === nodeOption.next.show.content) {
      if (active + 1 < total) {
        window.location.href = '/blog?page=' + (active + 2)
      }
    }

    // >>
    if (content === nodeOption.last.show.content) {
      window.location.href = '/blog?page=' + total
    }
  }

  Pagination.prototype.bindEvent = function() {
    var self = this
    var paginationUl = this.paginationUl

    paginationUl.addEventListener('click', function(e) {
      var target = e.target

      self.jump(target)

    }, false)
  }

  window.__PAGINATION__ = Pagination
})()