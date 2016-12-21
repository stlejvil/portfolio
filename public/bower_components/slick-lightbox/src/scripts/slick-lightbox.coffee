###
Slick Lightbox jQuery plugin
http://mreq.github.io/slick-lightbox/

Copyright 2014-2016 mreq https://github.com/mreq

Released under the MIT license

Documentation generated by [CoffeeDoc](http://github.com/omarkhan/coffeedoc)

http://mreq.github.io/slick-lightbox/docs/
###
class SlickLightbox
  ###
  The core class.
  ###
  constructor: (element, @options) ->
    ### Binds the plugin. ###
    @$element = $(element)
    @didInit = false
    slickLightbox = this
    @$element.on 'click.slickLightbox', @options.itemSelector, (e) ->
      e.preventDefault()
      $clickedItem = $(this)
      if typeof slickLightbox.options.shouldOpen is 'function'
        return unless slickLightbox.options.shouldOpen(slickLightbox, $clickedItem)
      $items = slickLightbox.filterOutSlickClones slickLightbox.$element.find(slickLightbox.options.itemSelector)
      slickLightbox.init $items.index($clickedItem)

  init: (index) ->
    ### Creates the lightbox, opens it, binds events and calls `slick`. Accepts `index` of the element, that triggered it (so that we know, on which slide to start slick). ###
    # @destroyPrevious()
    @didInit = true
    @detectIE()
    @createModal()
    @bindEvents()
    @initSlick(index)
    @open()

  createModalItems: ->
    ### Creates individual slides to be used with slick. If `options.images` array is specified, it uses it's contents, otherwise loops through elements' `options.itemSelector`. ###
    if @options.images
      links = $.map @options.images, (img) ->
        """<div class="slick-lightbox-slick-item"><div class="slick-lightbox-slick-item-inner"><img class="slick-lightbox-slick-img" src="#{ img }" /></div></div>"""
    else
      createItem = (el) =>
        caption = @getElementCaption(el)
        src = @getElementSrc(el)
        """<div class="slick-lightbox-slick-item"><div class="slick-lightbox-slick-item-inner"><img class="slick-lightbox-slick-img" src="#{ src }" />#{ caption }</div></div>"""
      $items = @filterOutSlickClones @$element.find(@options.itemSelector)
      links = $.map $items, createItem
    links

  createModal: ->
    ### Creates a `slick`-friendly modal. ###
    links = @createModalItems()

    html = """
    <div class="slick-lightbox slick-lightbox-hide-init#{ if @isIE then ' slick-lightbox-ie' else '' }" style="background: #{ @options.background };">
      <div class="slick-lightbox-inner">
        <div class="slick-lightbox-slick slick-caption-#{ @options.captionPosition }">#{ links.join('') }</div>
      <div>
    <div>
    """
    @$modalElement = $(html)
    @$parts = {}
    @$parts['closeButton'] = $(@options.layouts.closeButton)
    @$modalElement.find('.slick-lightbox-inner').append @$parts['closeButton']
    $('body').append @$modalElement

  initSlick: (index) ->
    ### Runs slick by default, using `options.slick` if provided. If `options.slick` is a function, it gets fired instead of us initializing slick. Merges in initialSlide option. ###
    # We need to start with the `index`-th item.
    additional =
      initialSlide: index
    if @options.slick?
      if typeof @options.slick is 'function'
        # TODO: support element's index
        @slick = @options.slick @$modalElement
      else
        @slick = @$modalElement.find('.slick-lightbox-slick').slick $.extend({}, @options.slick, additional)
    else
      @slick = @$modalElement.find('.slick-lightbox-slick').slick(additional)
    @$modalElement.trigger 'init.slickLightbox'

  open: ->
    ### Opens the lightbox. ###
    @writeHistory() if @options.useHistoryApi
    # Fire events
    @$element.trigger 'show.slickLightbox'
    setTimeout (=> @$element.trigger 'shown.slickLightbox'), @getTransitionDuration()
    @$modalElement.removeClass('slick-lightbox-hide-init')

  close: ->
    ### Closes the lightbox and destroys it, maintaining the original element bindings. ###
    # Fire events
    @$element.trigger 'hide.slickLightbox'
    setTimeout (=> @$element.trigger 'hidden.slickLightbox'), @getTransitionDuration()
    @$modalElement.addClass('slick-lightbox-hide')
    @destroy()

  bindEvents: ->
    ### Binds global events. ###

    # Slides size needs to be 100%, which can't be achieved easily via CSS on floated elements.
    resizeSlides = =>
      h = @$modalElement.find('.slick-lightbox-inner').height()
      @$modalElement.find('.slick-lightbox-slick-item').height h
      # max-height on the image is buggy
      @$modalElement.find('.slick-lightbox-slick-img, .slick-lightbox-slick-item-inner').css 'max-height', Math.round(@options.imageMaxHeight*h)
    $(window).on 'orientationchange.slickLightbox resize.slickLightbox', resizeSlides
    if @options.useHistoryApi
      $(window).on 'popstate.slickLightbox', => @close()
    @$modalElement.on 'init.slickLightbox', resizeSlides

    # Destroy event triggered by other instances
    @$modalElement.on 'destroy.slickLightbox', => @destroy()

    # Destroy event from unslickLightbox
    @$element.on 'destroy.slickLightbox', => @destroy true

    # Close button
    @$parts['closeButton'].on 'click.slickLightbox touchstart.slickLightbox', (e) =>
      e.preventDefault()
      @close()

    # Optional bindings
    if @options.closeOnEscape or @options.navigateByKeyboard
      # Close on ESC key
      $(document).on 'keydown.slickLightbox', (e) =>
        code = if e.keyCode then e.keyCode else e.which
        if @options.navigateByKeyboard
          if code is 37
            @slideSlick 'left'
          else if code is 39
            @slideSlick 'right'
        if @options.closeOnEscape
          @close()  if code is 27

    if @options.closeOnBackdropClick
      @$modalElement.on 'click.slickLightbox touchstart.slickLightbox', '.slick-lightbox-slick-img', (e) ->
        e.stopPropagation()
      @$modalElement.on 'click.slickLightbox', '.slick-lightbox-slick-item', (e) =>
        e.preventDefault()
        @close()

  slideSlick: (direction) ->
    ### Moves the slick prev or next. ###
    if direction is 'left'
      @slick.slick 'slickPrev'
    else
      @slick.slick 'slickNext'

  detectIE: ->
    ### Detects usage of IE8 and lower. ###
    @isIE = false
    if /MSIE (\d+\.\d+);/.test(navigator.userAgent)
      ieversion = new Number(RegExp.$1) # capture x.x portion and store as a number
      if ieversion < 9
        @isIE = true

  getElementCaption: (el) ->
    ### Returns caption for each slide based on the type of `options.caption`. ###
    return ''  unless @options.caption
    c = switch typeof @options.caption
      when 'function'
        @options.caption(el)
      when 'string'
        $(el).data(@options.caption)
    return """<span class="slick-lightbox-slick-caption">#{ c }</span>"""

  getElementSrc: (el) ->
    ### Returns src for each slide image based on the type of `options.src`. ###
    return switch typeof @options.src
      when 'function'
        @options.src(el)
      when 'string'
        $(el).attr(@options.src)
      else
        el.href

  unbindEvents: ->
    ### Unbinds global events. ###
    $(window).off '.slickLightbox'
    $(document).off '.slickLightbox'
    @$modalElement.off '.slickLightbox'

  destroy: (unbindAnchors = false) ->
    ### Destroys the lightbox and unbinds global events. If `true` is passed as an argument, unbinds the original element as well. ###
    if @didInit
      @unbindEvents()
      # Let transitions take effect
      setTimeout (=>
        @$modalElement.remove()
      ), @options.destroyTimeout
    if unbindAnchors
      @$element.off '.slickLightbox'
      @$element.off '.slickLightbox', @options.itemSelector

  destroyPrevious: ->
    ### Destroys lightboxes currently in DOM. ###
    $('body').children('.slick-lightbox').trigger 'destroy.slickLightbox'

  getTransitionDuration: ->
    ### Detects the transition duration to know when to remove stuff from DOM etc. ###
    return @transitionDuration  if @transitionDuration
    duration = @$modalElement.css('transition-duration')
    if typeof duration is 'undefined'
      @transitionDuration = 500
    else
      @transitionDuration = if duration.indexOf('ms') > -1 then parseFloat(duration) else parseFloat(duration) * 1000

  writeHistory: ->
    ### Writes an empty state to the history API if supported. ###
    history?.pushState?(null, null, '')

  filterOutSlickClones: ($items) ->
    ### Removes all slick clones from the set of elements. Only does so, if the target element is a slick slider. ###
    return $items unless @$element.hasClass('slick-slider')
    $items = $items.filter ->
      $item = $(this)
      not $item.hasClass('slick-cloned') and $item.parents('.slick-cloned').length is 0

# jQuery defaults
defaults =
  background: 'rgba(0,0,0,.8)'
  closeOnEscape: true
  closeOnBackdropClick: true
  destroyTimeout: 500
  itemSelector: 'a'
  navigateByKeyboard: true
  src: false
  caption: false
  captionPosition: 'dynamic'
  images: false
  slick: {}
  useHistoryApi: false
  layouts:
    closeButton: """<button type="button" class="slick-lightbox-close"></button>"""
  shouldOpen: null
  imageMaxHeight: 0.9

# jQuery methods
$.fn.slickLightbox = (options) ->
  ### Fires the plugin. ###
  options = $.extend {}, defaults, options
  $(this).each ->
    this.slickLightbox = new SlickLightbox this, options
  return this

$.fn.unslickLightbox = ->
  ### Removes everything. ###
  $(this).trigger('destroy.slickLightbox').each ->
    this.slickLightbox = null
