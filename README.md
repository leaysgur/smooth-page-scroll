# smooth-page-scroll

Apply smooth scroll for in page link.

> Note:
> This lib requires `window.{request,cancel}AnimationFrame`, `history.{push,replace}State`.

## Demo

See https://leader22.github.io/smooth-page-scroll

## Install

by `npm`.

```
npm i smooth-page-scroll --save
```

by `script` tag.

```html
<script src="./path/to/smooth-page-scroll.min.js"></script>
```

then,

```js
// for CommonJS
var SmoothPageScroll = require('smooth-page-scroll');

SmoothPageScroll.install();
```

finally,

```html
<a href="#dest">Go!</a>

<div id="dest">
  Destination
</div>
```

## Options

You can pass options as `install(options)`.

props | type | default | desc
:---- | :--: | :-----: | :---
gapX | number | `40` | Gap for destination posX.
gapY | number | `40` | Gap for destination posY.
duration | number | `500` | Duration for scrolling.
easing | func | `function (t) { return t*(2-t); } }` | Easing function for scrolling.
useHashAsHistory | bool | `true` | If true, pushState on hash has changed.
