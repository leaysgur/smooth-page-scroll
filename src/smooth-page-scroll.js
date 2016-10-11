'use strict';

function SPS() {
  return this;
}

SPS.prototype = {
  constructor:   SPS,
  install:       install,
  uninstall:     uninstall,
  update:        update,
  handleEvent:   handleEvent,

  _bindEvent:    _bindEvent,
  _unbindEvent:  _unbindEvent,
  _scrollByHash: _scrollByHash,
  _scrollTo:     _scrollTo,
};

module.exports = (new SPS());


function install(options) {
  options = options || {};
  this.options = {
    gapX:     options.gapX     || 40,
    gapY:     options.gapY     || 40,
    duration: options.duration || 500,
    easing:   options.easing   || function (t) { return t*(2-t); },

    useHashAsHistory: true,
  };
  if ('useHashAsHistory' in options) {
    this.options.useHashAsHistory = options.useHashAsHistory;
  }

  this._bindEvent();
  this._scrollByHash(location.hash);
}

function uninstall() {
  this._unbindEvent();
}

function update() {
  this._bindEvent();
}

function handleEvent(ev) {
  ev.preventDefault();
  var hash = ev.currentTarget.hash;
  var method = this.options.useHashAsHistory ? 'pushState' : 'replaceState';

  this._scrollByHash(hash);
  history[method](null, null, hash);
}

function _bindEvent() {
  var inPageUrl = location.origin + location.pathname;
  var $a = document.getElementsByTagName('a');

  [].forEach.call($a, function(el) {
    if (el.origin + el.pathname === inPageUrl && !el._SPS) {
      el.addEventListener('click', this, false);
      el._SPS = true;
    }
  }, this);
}

function _unbindEvent() {
  var $a = document.getElementsByTagName('a');
  [].forEach.call($a, function(el) {
    if (el._SPS) {
      el.removeEventListener('click', this, false);
      delete el._SPS;
    }
  }, this);
}

function _scrollByHash(hash) {
  var destEl = document.getElementById(hash.slice(1));

  if (hash.length === 0 || !destEl) { return; }

  var offset = destEl.getBoundingClientRect();
  var curX = window.scrollX || window.pageXOffset,
      curY = window.scrollY || window.pageYOffset;

  destEl && this._scrollTo(offset.left + curX, offset.top + curY, this.options);
}

function _scrollTo(x, y, options) {
  var duration = options.duration,
      easing   = options.easing;
  x -= options.gapX;
  y -= options.gapY;

  var frame = null;
  var fromX = window.scrollX || window.pageXOffset,
      fromY = window.scrollY || window.pageYOffset,
      startTime = Date.now();

  frame && window.cancelAnimationFrame(frame);

  frame = window.requestAnimationFrame(__step);
  function __step() {
    var time = Date.now(),
        val,
        curX, curY;

    var elapsed = (time - startTime) / duration;
    elapsed = elapsed > 1 ? 1 : elapsed;
    val = easing(elapsed);

    curX = fromX + (x - fromX) * val;
    curY = fromY + (y - fromY) * val;

    window.scrollTo(curX, curY);

    if (curX === x && curY === y) {
      cancelAnimationFrame(frame);
      fromX = fromY = startTime = frame = null;
      return;
    }

    frame = window.requestAnimationFrame(__step);
  }
}
