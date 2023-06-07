import type { Rule, TurndownService } from './types'

const indexOf = Array.prototype.indexOf
const every = Array.prototype.every
const rules: Record<string, Rule> = {}

rules["tableCell"] = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    return cell(content, node)
  }
}

rules["tableRow"] = {
  filter: 'tr',
  replacement: function (content, node) {
    let borderCells = ''
    const alignMap = { left: ':--', right: '--:', center: ':-:' }

    if (isHeadingRow(node as HTMLTableRowElement)) {
      for (let i = 0; i < node.childNodes.length; i++) {
        let border = '---'
        const childNode = node.childNodes[i] as HTMLElement
        const align = (
          childNode.getAttribute('align') || ''
        ).toLowerCase() as keyof typeof alignMap

        if (align) border = alignMap[align] || border

        borderCells += cell(border, node.childNodes[i])
      }
    }
    return '\n' + content + (borderCells ? '\n' + borderCells : '')
  }
}

rules["table"] = {
  // Only convert tables with a heading row.
  // Tables with no heading row are kept using `keep` (see below).
  filter: function (node) {
    return node.nodeName === 'TABLE' && isHeadingRow((node as HTMLTableElement).rows[0])
  },

  replacement: function (content, node) {
    // Ensure there are no blank lines
    const colLen = (node as HTMLTableElement).rows[0].querySelectorAll('td').length
    const emptyCol = Array.from({ length: colLen }).map(() => '|').join('')
    content = content.replace(/\n\n/g, `\n${emptyCol}|\n`)
    return '\n\n' + content + '\n\n'
  }
}

rules["tableSection"] = {
  filter: ['thead', 'tbody', 'tfoot'],
  replacement: function (content) {
    return content
  }
}

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
function isHeadingRow (tr: HTMLTableRowElement) {
  const parentNode = tr.parentNode
  return (
    parentNode?.nodeName === 'THEAD' ||
    (
      (parentNode?.nodeName === 'TABLE' || isFirstTbody(parentNode as HTMLElement)) && (
        tr.previousSibling === null ||
        every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
      )
    )
  )
}

function isFirstTbody (element: HTMLElement) {
  const previousSibling = element?.previousSibling
  return (
    element?.nodeName === 'TBODY' && (
      !previousSibling ||
      (
        previousSibling.nodeName === 'THEAD' &&
        /^\s*$/i.test(previousSibling?.textContent || '')
      )
    )
  )
}

function cell (content: string, node: Node) {
  const index = indexOf.call(node.parentNode?.childNodes, node)
  let prefix = ' '
  if (index === 0) prefix = '| '
  return prefix + content.trim () + ' |'
}

export default function tables (turndownService: TurndownService) {
  // Better to convert malformed tables too, more convenient
  // turndownService.keep(function (node) {
  //   return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0])
  // })
  for (const key in rules) turndownService.addRule(key, rules[key])
}
