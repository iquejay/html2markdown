import type { TurndownService } from "./types"

export default function taskListItems (turndownService: TurndownService) {
  turndownService.addRule('taskListItems', {
    filter: function (node) {
      return (node as HTMLInputElement).type === 'checkbox' && node.parentNode?.nodeName === 'LI'
    },
    replacement: function (_, node) {
      return ((node as HTMLInputElement).checked ? '[x]' : '[ ]') + ' '
    }
  })
}
