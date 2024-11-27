<template>
  <div class="markdown-body" ref="markdown-it-vue-container"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItSubscript from 'markdown-it-sub'
import MarkdownItSuperscript from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbreviation from 'markdown-it-abbr'
import MarkdownItInsert from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItLatex from 'src/utils/latex/src'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItGithubToc from 'markdown-it-github-toc'
import MarkdownItSourceMap from 'markdown-it-source-map'
import MarkdownItLinkAttributes from './markdown/markdown-it-link-attributes'
import MarkdownItEcharts from './markdown/markdown-it-plugin-echarts'
import MarkdownItFlowchart from './markdown/markdown-it-plugin-flowchart'
import MarkdownItHighlight from './markdown/markdown-it-highlight.js'
import MarkdownItMermaid from './markdown/markdown-it-plugin-mermaid'

import MarkdownItFontAwsome from './markdown/markdown-it-font-awsome'
import 'github-markdown-css'
import 'src/utils/latex/src/katex.css'

import echarts from 'echarts/dist/echarts.simple.min'
import mermaid from 'mermaid'
import flowchart from 'flowchart.js'

const DEFAULT_OPTIONS_LINK_ATTRIBUTES = {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
}
const DEFAULT_OPTIONS_KATEX = { throwOnError: false, errorColor: '#cc0000' }
const DEFAULT_OPTIONS_TASKLISTS = null
const DEFAULT_OPTIONS_GITHUBTOC = {
  tocFirstLevel: 2,
  tocLastLevel: 3,
  tocClassName: 'toc',
  anchorLinkSymbol: '',
  anchorLinkSpace: false,
  anchorClassName: 'anchor',
  anchorLinkSymbolClassName: 'octicon octicon-link'
}

export default {
  name: 'markdown-it-vue',
  props: {
    content: {
      type: String
    },
    options: {
      type: Object,
      default() {
        return {
          markdownIt: {
            linkify: true,
            html: true
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          katex: DEFAULT_OPTIONS_KATEX,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          githubToc: DEFAULT_OPTIONS_GITHUBTOC
        }
      }
    }
  },
  watch: {
    content: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs['markdown-it-vue-container'].innerHTML = this.md.render(val)
          // var clipboard = new ClipboardJS('.btn');
          document.querySelectorAll('pre > code').forEach(function (codeBlock) {
            var pre = codeBlock.parentNode
            var codeContainer = document.createElement('div')
            codeContainer.className = 'code-container'
            pre.parentNode.insertBefore(codeContainer, pre)
            codeContainer.appendChild(pre)
            var button = document.createElement('button')
            button.className = `copy-code-button`
            button.type = 'button'
            button.innerText = 'Copy'

            pre.appendChild(button)
            button.addEventListener('click', function () {
              navigator.clipboard.writeText(codeBlock.innerText).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur()

                button.innerText = 'Copied!'

                setTimeout(function () {
                  button.innerText = 'Copy'
                }, 2000)
              })
            })
          })
          // render echarts
          document.querySelectorAll('.md-echarts').forEach((element) => {
            try {
              const options = JSON.parse(element.textContent)
              const chart = echarts.init(element)
              chart.setOption(options)
            } catch (e) {
              element.outerHTML = `<pre>echarts complains: ${e}</pre>`
            }
          })
          // render mermaid
          mermaid.init(undefined, document.querySelectorAll('.mermaid'))
          // render flowchart
          document.querySelectorAll('.md-flowchart').forEach((element) => {
            try {
              const code = element.textContent
              const chart = flowchart.parse(code)
              element.textContent = ''
              chart.drawSVG(element)
            } catch (e) {
              element.outerHTML = `<pre>flowchart complains: ${e}</pre>`
            }
          })
        })
      }
    }
  },
  data() {
    const optMarkdownIt = this.options.markdownIt
    const linkAttributes = this.options.linkAttributes || DEFAULT_OPTIONS_LINK_ATTRIBUTES
    const optKatex = this.options.katex || DEFAULT_OPTIONS_KATEX
    const optTasklists = this.options.tasklists || DEFAULT_OPTIONS_TASKLISTS
    const optGithubToc = this.options.githubToc || DEFAULT_OPTIONS_GITHUBTOC

    const md = new MarkdownIt(optMarkdownIt)
      .use(MarkdownItEmoji)
      .use(MarkdownItSubscript)
      .use(MarkdownItSuperscript)
      .use(MarkdownItFootnote)
      .use(MarkdownItDeflist)
      .use(MarkdownItAbbreviation)
      .use(MarkdownItInsert)
      .use(MarkdownItMark)
      .use(MarkdownItHighlight)
      .use(MarkdownItLatex)
      .use(MarkdownItSourceMap)
      .use(MarkdownItMermaid)
      .use(MarkdownItEcharts)
      .use(MarkdownItFlowchart)
      .use(MarkdownItLinkAttributes, linkAttributes)
      .use(MarkdownItKatex, optKatex)
      .use(MarkdownItTasklists, optTasklists)
      .use(MarkdownItFontAwsome)
      .use(MarkdownItGithubToc, optGithubToc)
      .use(MarkdownItContainer, 'warning', {
        validate: function (params) {
          return params.trim() === 'warning'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'info', {
        validate: function (params) {
          return params.trim() === 'info'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'success', {
        validate: function (params) {
          return params.trim() === 'success'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'error', {
        validate: function (params) {
          return params.trim() === 'error'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
          } else {
            return '</div>'
          }
        }
      })

    return {
      md: md
    }
  },
  methods: {
    use(plugin, options) {
      this.md.use(plugin, options)
    },
    get() {
      return this.md
    }
  }
}
</script>

<style lang="scss">
.markdown-it-vue-alter-info {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
}
.markdown-it-vue-alert-icon-info {
  color: #1890ff;
}
.markdown-it-vue-alter-success {
  border: 1px solid #b7eb8f;
  background-color: #f6ffed;
}
.markdown-it-vue-alert-icon-success {
  color: #52c41a;
}
.markdown-it-vue-alter-error {
  border: 1px solid #f5222d;
  background-color: #fff1f0;
}
.markdown-it-vue-alert-icon-error {
  color: #f5222d;
}
.markdown-it-vue-alter-warning {
  border: 1px solid #ffe58f;
  background-color: #fffbe6;
}
.markdown-it-vue-alert-icon-warning {
  color: #faad14;
}
.markdown-it-vue-alter {
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
  display: inline-flex;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  padding: 0;
  list-style: none;
  position: relative;
  padding: 8px 15px 8px 37px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}
.markdown-it-vue-alter p {
  margin-bottom: 2px;
}

.markdown-it-vue-alert-icon {
  top: 11.5px;
  left: 16px;
  position: absolute;
}

.code-container {
  position: relative;
  pre {
    padding-bottom: 32px !important;
    background-color: $grey-12;
  }
}
.copy-code-button {
  color: #ffffff;
  background-color: $green-12;

  /* right-align */
  display: block;
  margin-left: auto;
  margin-right: 0;
  position: absolute;
  right: 10px;
  bottom: 12px;
  border: 1px solid;
  padding: 6px 14px;
  font-size: 13px;
}

.copy-code-button:hover {
  cursor: pointer;
  background-color: #1aa260;
}

.copy-code-button:focus {
  /* Avoid an ugly focus outline on click in Chrome,
       but darken the button for accessibility.
       See https://stackoverflow.com/a/25298082/1481479 */
  background-color: #e6e6e6;
  outline: 0;
}

.copy-code-button:active {
  background-color: #d9d9d9;
}

.highlight pre {
  /* Avoid pushing up the copy buttons. */
  margin: 0;
}

.q-dark {

  .markdown-body {
    background-color: $blue-10;
    color: white;

    pre {
      background-color: $blue-8;
      color: white;
    }

    .copy-code-button {
      background: #48d091;
      border: 1px transparent;
      padding: 8px 20px;
      font-size: 14px;
    }
  }
  blockquote {
    color: white;
  }
  a {
    color: white;
  }
}
</style>

<style lang="css">
@media (prefers-color-scheme: dark) {
  .markdown-body {
    color-scheme: dark;
    --color-prettylights-syntax-comment: #6e7781;
    --color-prettylights-syntax-constant: #0550ae;
    --color-prettylights-syntax-entity: #8250df;
    --color-prettylights-syntax-storage-modifier-import: #24292f;
    --color-prettylights-syntax-entity-tag: #116329;
    --color-prettylights-syntax-keyword: #cf222e;
    --color-prettylights-syntax-string: #0a3069;
    --color-prettylights-syntax-variable: #953800;
    --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
    --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
    --color-prettylights-syntax-invalid-illegal-bg: #82071e;
    --color-prettylights-syntax-carriage-return-text: #f6f8fa;
    --color-prettylights-syntax-carriage-return-bg: #cf222e;
    --color-prettylights-syntax-string-regexp: #116329;
    --color-prettylights-syntax-markup-list: #3b2300;
    --color-prettylights-syntax-markup-heading: #0550ae;
    --color-prettylights-syntax-markup-italic: #24292f;
    --color-prettylights-syntax-markup-bold: #24292f;
    --color-prettylights-syntax-markup-deleted-text: #82071e;
    --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
    --color-prettylights-syntax-markup-inserted-text: #116329;
    --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
    --color-prettylights-syntax-markup-changed-text: #953800;
    --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
    --color-prettylights-syntax-markup-ignored-text: #eaeef2;
    --color-prettylights-syntax-markup-ignored-bg: #0550ae;
    --color-prettylights-syntax-meta-diff-range: #8250df;
    --color-prettylights-syntax-brackethighlighter-angle: #57606a;
    --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
    --color-prettylights-syntax-constant-other-reference-link: #0a3069;
    --color-fg-default: #24292f;
    --color-fg-muted: #57606a;
    --color-fg-subtle: #6e7781;
    --color-canvas-default: #ffffff;
    --color-canvas-subtle: #f6f8fa;
    --color-border-default: #d0d7de;
    --color-border-muted: hsla(210, 18%, 87%, 1);
    --color-neutral-muted: rgba(175, 184, 193, 0.2);
    --color-accent-fg: #0969da;
    --color-accent-emphasis: #0969da;
    --color-attention-subtle: #fff8c5;
    --color-danger-fg: #cf222e;
  }
}
</style>
