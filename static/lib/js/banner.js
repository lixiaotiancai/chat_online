// banner component
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

  // banner
  function Banner(opt) {
    var config = {
      id: '', // banner id
      active: 0, // active image
      content: [], // [{image: url, href: href, background_color: color}]
      interval: 1500 // change interval
    }

    var option = this.option = T.merge(config, opt)

    var banner = this.banner = T.byId(option.id)

    this.controlBtn = T.qS('.control-btn', banner)
    this.preBtn = T.qS('.pre-btn', banner)
    this.nextBtn = T.qS('.next-btn', banner)
    this.imageBox = T.qS('.banner-img-wrapper', banner)
    this.pointBox = T.qS('.img-nav-point-box', banner)

    this.createImage(option.content)
    this.createNavPoint(option.content)

    this.image = T.qSA('.banner-img-box', banner)
    this.point = T.qSA('.img-nav-point', banner)

    this.showInitBanner(option.content, option.active)
    this.bindEvent()
  }

  // 生成对应图片
  Banner.prototype.createImage = function(content) {
    var len = content.length
    var innerImgHTML = ''

    for (var i = 0; i < len; i++) {
      innerImgHTML += '' +
        '<a href=' + content[i].href + ' class="banner-img-box">' +
        '<img src=' + content[i].image + ' alt="banner_img"' + ' class="banner-img" />' +
        '</a>'
    }

    this.imageBox.innerHTML = innerImgHTML
  }

  // 生成对应导航点
  Banner.prototype.createNavPoint = function(content) {
    var len = content.length
    var innerNavHTML = ''

    for (var i = 0; i < len; i++) {
      innerNavHTML += '' +
        '<div class="img-nav-point-wrapper">' +
        '<div class="img-nav-point"></div>' +
        '</div>'

    }

    this.pointBox.innerHTML = innerNavHTML
  }

  // 生成原始轮播图
  Banner.prototype.showInitBanner = function(content, active) {
    var len = this.image.length

    for (var i = 0; i < len; i++) {
      if (active === i) {
        this.pre = i
        this.image[i].classList.add('banner-img-active')
        this.point[i].classList.add('nav-point-active')
        this.banner.style.background = content[i].background_color
      } else {
        this.image[i].classList.add('banner-img-hide')
      }
    }
  }

  // show active image
  Banner.prototype.showActiveImage = function(active) {
    var pre = this.pre
    var len = this.image.length

    if (active == pre) return

    for (var i = 0; i < len; i++) {
      if (i == pre) {
        this.image[i].classList.remove('banner-img-active')
        this.image[i].classList.remove('banner-img-appear')
        this.image[i].classList.add('banner-img-disappear')
        this.point[i].classList.remove('nav-point-active')
      } else if (i == active) {
        this.pre = active
        this.image[i].classList.add('banner-img-appear')
        this.point[i].classList.add('nav-point-active')
        this.image[i].classList.remove('banner-img-hide')
        this.image[i].classList.remove('banner-img-disappear')
        this.banner.style.background = this.option.content[i].background_color
      }
    }
  }

  Banner.prototype.bindEvent = function() {
    var self = this
    var timer = null

    function createTimer() {
      if (!timer) {
        timer = window.setInterval(function() {
          self.nextBtn.click()
        }, self.option.interval)
      }
    }

    function clearTimer() {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }

    createTimer()

    this.banner.addEventListener('mouseenter', function(e) {
      e.stopPropagation()
      clearTimer()
      self.controlBtn.classList.remove('hidden')
    }, false)

    this.banner.addEventListener('mouseleave', function(e) {
      e.stopPropagation()
      createTimer()
      self.controlBtn.classList.add('hidden')
    }, false)

    this.preBtn.addEventListener('click', function(e) {
      e.stopPropagation()
      self.option.active !== 0 ? self.option.active-- : self.option.active = self.image.length - 1
      self.showActiveImage(self.option.active)
    }, false)

    this.nextBtn.addEventListener('click', function(e) {
      e.stopPropagation()
      self.option.active !== self.image.length - 1 ? self.option.active++ : self.option.active = 0
      self.showActiveImage(self.option.active)
    }, false)

    this.pointBox.addEventListener('mouseover', function(e) {
      e.stopPropagation()
      var target = e.target
      if (target && target.tagName.toUpperCase() === 'DIV' && target.classList.contains('img-nav-point')) {
        self.option.active = self.point.indexOf(target)
        self.showActiveImage(self.option.active)
      }
    })
  }

  window.__BANNER__ = Banner
})()