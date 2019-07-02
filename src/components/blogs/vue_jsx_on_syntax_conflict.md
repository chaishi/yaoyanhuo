# Vue 项目中使用 JSX 出现的语法冲突，导致 props 传入失效

*posted by yaoyanhuo on 2019-03-22*

> 有这样一个场景，switch 组件需要两个 props 参数：onText 和 offText，用于表述开关状态。在 JSX 使用 switch 组件时，在控制台发现 offText 传入 props 很正常，但 onText 却怎么也没有数据，无论传值是什么。这是为何呢？一起来看看吧。

从 2016 年写 Vue 到现在，总觉得该遇到的问题都差不多了，结果这就来了个意料之外的问题，如上引文描述。

## Vue 和 JSX 的关系

官网地址描述: https://cn.vuejs.org/v2/guide/render-function.html 。内容比较多，此处简述一下，Vue 有两种书写 html 的方式，一种是在 `.vue` 文件中使用 `template`，很方便，跟写直接写 html 一样，该方式也是官方建议的方式；另一种是在 `.js` 文件中使用 `render` 函数书写，该方式书写比较复杂，可读性也不好，但有时候确实需要使用这种方式 那怎么办呢？`JSX` 就出来了。可以说，`JSX` 是 `createElement` 方法的一种语法糖。

## 问题复现 Demo

父组件：test.js

```js
import DSwitch from './switch.js'

export default {
  name: 'Test',
  components: { DSwitch },
  render () {
    return <div>
      <d-switch offText="已关闭" onText="已打开"></d-switch>
    </div>
  }
}

```

子组件：switch.js

```js
export default {
  name: 'DSwitch',

  props: {
    onText: {
      default: 'open'
    },
    offText: {
      default: 'closed'
    }
  },

  render () {
    return <div>
      <p>onText: {this.onText}</p>
      <p>offText: {this.offText}</p>
    </div>
  }
}
```

运行结果如图，

![运行结果](http://img.yaoyanhuo.com/jsx_on_syntax.png)

是不是很奇怪，传入的 `offText` 正常显示了， 而 `onText` 却没有。

## 问题排查过程

`onText` 和 `offText` 是相对参数，一模一样的代码逻辑。按理说，要么都可以正常传入，要么都不可以。为何偏偏 `onText` 不可以？
- 第一步，新增一个 props 测试：以同样的方式添加一个新的 props `testText`，运行结果和 `offText` 一样正常。这就奇了怪了，咋 `onText` 就不行了呢？
- 第二步，再来试试看，把 `onText` 改成 `osText`，我去，竟然可以了 ！可以正常显示出来了！惊呆了宝宝。
- 这下再看 `onText` 和 `osText` 的区别，唯一的点就是 `on` 和  `os` 了，`on` 越看越眼熟，`JSX` 语法有 `onChange` `onInput` 什么的，由此，应该是语法冲突，`onText` 被 `JSX` 识别成了 `on` 类语法。

## 解决方案

找到问题原因了，那怎么解决呢？

- 最容易想到的一个方法就是改 props 名称，`onText` 改成 `openText` 一类的，可是如此一来，不仅组件 `switch` 要改，连使用到的项目也都要改。于组件库而言，特别是使用者众多的组件库而言，没有比突然的 API 接口变更 更让人心塞的了。那咋办呢？
- 加一个 `onText` 同类参数？使用 `onText || openText` 这种法子。当 `onText` 不存在时，取 `openText`。这样虽然能解决旧项目不用改变 API 使用的问题，但是增加了 API  复杂度，一个功能却使用两个参数实现，怎么都觉得不高级。
- 继续想，既然我能遇到这个问题，那肯定还有其他人也遇到吧？JSX 怎么处理的呢？Google 和 github 搜了一波，没结果。好吧，只能看看 JSX 的 Example 了（ https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js ）。这一看关键了，JSX 有两种书写方式，既然当前书写方式不行，不能被正常识别。那就试试另一个看起来 80% 可行的方式，毕竟不用单独识别语法，直接一个参数囊括各种 API。一试，果然，`{...params}` 这种方式运行正常了！！！！

由此，终极解决方案如下，换种 JSX 书写方式。

父组件：test.js
```js
import DSwitch from './switch.js'

export default {
  name: 'Test',
  components: { DSwitch },
  render () {
    const params = {
      props: {
        offText: "已关闭",
        onText: "已打开"
      }
    }
    return <div>
      <d-switch {...params}></d-switch>
    </div>
  }
}

```

运行结果如下图，

![运行结果](http://img.yaoyanhuo.com/jsx_on_syntax_right.png)

完美解决！无需改动任何组件库代码！