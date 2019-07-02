/**
 * Example
 *  npm run blog create <name> // 创建博客
 *  npm run blog delete <name> // 删除博客
 *  npm run blog list // 生成博客列表
 */

const fs = require('fs')
// https://www.cnblogs.com/seakingii/archive/2012/01/01/2309294.html
require('colors')
const dayjs = require('dayjs')
const BLOG_PATH = './src/components/blogs/'
const BLOG_BATH_PATH = './src/pages/blog/index.vue'
const args = process.argv

const COMMAND_MAP = {
  'create': createBlog,
  'list': updateBlogList,
  'delete': deleteBlog
}

if (validateParams(args)) {
  COMMAND_MAP[args[2]]()
}

function validateParams (args) {
  if (['create', 'list', 'delete'].indexOf(args[2]) === -1) {
    throw Error('the first param of blog must be the follows: create/list/delete')
  }
  if (args[2] === 'create' && !args[3]) {
    throw Error('missing the param of file name')
  }
  return true
}

function createBlog () {
  fs.writeFile(BLOG_PATH + args[3] + '.md', 'title', function (e) {
    if (e) {
      throw Error(e)
    }
    console.info('blog file was created'.green)
    
    fs.readFile(BLOG_BATH_PATH, function (e, data) {
      if (e) throw Error(e)
      content = data.toString()
      // upper the first letter
      const name = toHump(args[3]).replace(/\w/, function (a) {return  a.toUpperCase()})
      console.log('name: ' + name + '\n')
      if (content.indexOf(name) !== -1) {
        console.warn('this file has been imported'.yellow)
        return
      }
      content = content.replace(/(?<=script>)[\s|\S]*?(?=export)/, function (a) {
        return `\nimport ${name} from '@/components/blogs/${args[3]}.md'${a}`
      }).replace(/(?<=map: \{)[\s|\S]+?(?=\})/, function (a) {
        return `\n        ${args[3]}: ${name},${a}`
      }).replace(/(?<=components\: \{)[\s|\S]+?(?=\})/, function (a) {
        return ` ${name}, ${a.trim()} `
      })
      fs.writeFile(BLOG_BATH_PATH, content, function (e) {
        if (e) throw error(e)
        console.log('blog file was imported'.green)
      })
    })
  })
}

function deleteBlog () {
  const file = BLOG_PATH + args[3] + '.md'
  fs.unlink(file, function (e) {
    if (e) throw Error(e)
    console.log('blog file has been deleted.'.green)
  })
  fs.readFile(BLOG_BATH_PATH, function (e, data) {
    if (e) throw Error(e)
    content = data.toString()
    const name = toHump(args[3]).replace(/\w/, function (a) {return  a.toUpperCase()})
    content = content.replace(`${name}, `, '')
              .replace(`\n        ${args[3]}: ${name},`, '')
              .replace(`\nimport ${name} from '@/components/blogs/${args[3]}.md'`, '')
    fs.writeFile(BLOG_BATH_PATH, content, function (e) {
      if (e) throw error(e)
      console.log('blog file was canceled importing'.green)
    })
  })
}

// try to insert in npm run build ??
function updateBlogList () {
  fs.readdir(BLOG_PATH, function (e, files) {
    if (e) throw Error(e)
    const list = []
    const len = files.length
    files.forEach((file, index) => {
      if (file.indexOf('.md') === -1) return
      fs.readFile(BLOG_PATH + file, function (e, data) {
        const content = data.toString()
        console.log(file)
        list.push({
          title: content.match(/^#([\S|\s]+?)\n/)[1].trim(),
          date: content.match(/(?<=\*).*?(?=\*)/)[0],
          url: '/blog/' + file.split('.')[0],
          content: content.match(/>([\s|\S]+?)\n/)[1].trim()
        })
        if (len - 1 === list.length) {
          const _list = sortByKey(list, 'date')
          let result = JSON.stringify(_list, null, 2)
          result = `/* this file is built from the files in the dir of components/blog/ */\n\nconst blogList = ${result} \n\nexport default blogList\n`
          fs.writeFile('./src/const/blog.js', result, function (e) {
            if (e) throw Error(e)
            console.log('blog list has been updated.')
          })
        }
      })
    })
  })
}

function sortByKey (arr, key='date') {
  return arr.sort(function (a, b) {
    let dateA = a[key].match(/\d{4}-\d{2}-\d{2}/)[0]
    let dateB = b[key].match(/\d{4}-\d{2}-\d{2}/)[0]
    console.log(dateA, dateB)
    return dayjs(dateA).isBefore(dayjs(dateB)) ? 1 : -1
  })
}

// 下划线转换驼峰
function toHump(name) {
  return name.replace(/\_(\w)/g, function(all, letter){
      return letter.toUpperCase()
  })
}

// 驼峰转换下划线
function toLine(name) {
return name.replace(/([A-Z])/g,"_$1").toLowerCase()
}
