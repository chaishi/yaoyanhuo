const marked = require('marked')
const Prism = require('prismjs')

function parseMarkdown(source) {
  const renderer = new marked.Renderer()
  renderer.code = (code, language, escaped) => {
    let syntax = Prism.languages.markup
		switch (language) {
			case 'css':
				syntax = Prism.languages.css
				break
			case 'js':
			case 'javascript':
				syntax = Prism.languages.javascript
				break
    }
		return `<pre><code>${Prism.highlight(code, syntax)}</code></pre>`
  }
  return marked(source, {renderer})
}

module.exports = function (source) {
  const result = parseMarkdown(source)
  return `
    <template>
      <div class="markdown-to-vue-loader">${result}</div>
    </template>
  `
}
