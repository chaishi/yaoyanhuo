# JS 如何判断一个元素是否在可视区域

*posted by yaoyanhuo on 2019-03-27*

> 最近做的项目，需要上报广告的曝光和点击数据，理解下来本质是检测某个元素是否在可视区域内。由于一个元素有很多位置信息，相对于页面，相对于窗口，相对于父元素，client /offset /top /bottom /right /left /scroll /pageXOffset/... 基本上已经把自己搞晕了。每次使用的时候都要进行一波查询，费时，特此记录。

## 认识 getBoundingClientRect

**兼容性**：现代浏览器基本上都已支持，详细兼容性查看：https://caniuse.com/#search=getBoundingClientRect。

**使用方法**：`$0.getBoundingClientRect()`，`$0` 是通过 `Elements` 面板选中的元素，方法返回值是 `DOMRect` 对象，其属性均为只读，如下，
``` js
domRect: {
  top: 123.0,  // Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。
  bottom: 123, // Y 轴，相对于视口原点（viewport origin）矩形盒子的底部
  left: 123, // X 轴，相对于视口原点（viewport origin）矩形盒子的左侧
  right: 123, // X 轴，相对于视口原点（viewport origin）矩形盒子的右侧
  height: 123, // 矩形盒子的高度（等同于 bottom 减 top）
  width: 123.1, // 矩形盒子的宽度（等同于 right 减 left）
  x: 123, // X 轴，相对于视口原点（viewport origin）矩形盒子的左侧
  y: 123.0 // Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部
}
```

视口原点指窗口可视区域左上角，如下图。当元素滚出视口时，除了 `width` 和 `height`，其它属性值可能为负。

![相对位置](https://mdn.mozillademos.org/files/15087/rect.png)

从官方描述来看，`top === y`， `left === x`， `height = bottom - top`， `width = right - left`。

该对象本身只有 `left` `top` `bottom` `right`，至于 `x` `y` `width` `height` 是后来加上的。因此，为保证更好的兼容性，可以优先使用前 4 个属性。比如  IE8 就只支持 `left` 和 `top`，不支持 `x` 和 `y`。

如果你想问，为什么已经有了 `left` 和 `top`，还要添加 `x` 和  `y`，这不是重复多事儿么？嗯... 好巧... 我也正在思考这个问题，如果您知道答案，欢迎通过邮件 yaoyanhuoyi@qq.com 告诉我。


## 元素盒模型宽度和距离信息

```js
$0.clientHeight // clientHeight = CSS height + CSS padding - 水平滚动条高度 (如果存在)，如下图示范
$0.clientWidth  // clientWidth = CSS width + CSS padding - 垂直滚动条高度 (如果存在)，如下图示范
$0.clientTop  // 元素顶部边框的宽度，单位 px
$0.clientLeft  // 元素左侧边框的宽度，单位 px

$0.offsetHeight  // offsetHeight = CSS height + CSS padding + 水平滚动条高度 (如果存在) + css border，如下图示范
$0.offsetWidth  // offsetWidth = CSS height + CSS padding + 垂直滚动条高度 (如果存在) + css border，如下图示范
$0.offsetParent  // 返回距离 $0 最近的定位祖先元素，即在定位过程中，可知当前元素是依据哪个元素定位的
$0.offsetTop  // 返回当前元素相对于其 offsetParent 元素的顶部的距离
$0.offsetLeft  // 返回当前元素相对于其 offsetParent 元素的左侧的距离

$0.scrollHeight // 测量方式同 clientHeight，只是还包括因滚动被未显示出来的内容。如果没有滚动条，scrollHeight = clientHeight
$0.scrollWidth // 测量方式同 clientWidth，只是还包括因滚动被未显示出来的内容。如果没有滚动条，scrollWidth = clientWidth
$0.scrollTop // 可滚动元素 已滚动顶部距离
$0.scrollLeft // 可滚动元素 已滚动左侧距离 
```

![clientHeight](https://mdn.mozillademos.org/files/346/Dimensions-client.png)
![offsetHeight](https://mdn.mozillademos.org/files/347/Dimensions-offset.png)

## 窗口位置信息

```js
window.innerHeight // 浏览器窗口的视口（viewport）高度（单位：px），如果有水平滚动条，也包括滚动条高度
window.innerWidth // 浏览器窗口的视口（viewport）宽度（单位：px），如果有垂直滚动条，也包括滚动条高度

window.pageXOffset  // 是 window.scrollX 别名，为了更好的兼容性和方便性，使用 pageXOffset，而 scrollX 存在元素位置种类多，写起来麻烦
window.pageYOffset // 是 window.scrollY 别名，为了更好的兼容性和方便性，使用 pageXOffset，而 scrollY 存在元素位置种类多，写起来麻烦
```

IE9 以前的老浏览器就需要按照如下方式兼容处理窗口滚动距离，如果是现代浏览器直接使用 pageXOffset 即可。

```js
var x = (window.pageXOffset !== undefined)
  ? window.pageXOffset
  : (document.documentElement || document.body.parentNode || document.body).scrollLeft;

var y = (window.pageYOffset !== undefined)
  ? window.pageYOffset
  : (document.documentElement || document.body.parentNode || document.body).scrollTop;
```

## 如何获取元素相对于整个页面的位置？

元素绝对位置 = 滚动距离 + 元素到可视窗口的距离

```js
function getElementPos () {
  let {left, top} = $0.getBoundingClientRect()
  x = window.pageXOffset + left
  y = window.pageYOffset + top
  return {x, y}
}
```

## 如何判断一个元素是否在可视区域内？

先判断垂直方向在可视区域内，再判断水平方向在可视区域内。

![元素位置](http://img.yaoyanhuo.com/element_4.png)


```js
function isElementVisible () {
  let {top, left, width, height} = $0.getBoundingClientRect()
  // 水平和垂直两个方向同时在可视区域
  return top < window.innerHeight && top * (-1) < height && left < window.innerWidth && left * (-1) < width
}
```

## 参考资料

- MDN：https://developer.mozilla.org/zh-CN/docs