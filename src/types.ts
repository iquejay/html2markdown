import type TurndownService from 'turndown'
import type { Options as TurndownOptions, Rule } from 'turndown'

/* MAIN */
type Parser = {
  new (): {
    parseFromString: ( html: string, mimeType: DOMParserSupportedType ) => Document
  }
};
interface Options extends TurndownOptions {
  parser?: Parser
  getImgSrc?: (src: string) => string
  getLinkHref?: (src: string) => string
}

/* EXPORT */

export type { Options, TurndownOptions, TurndownService, Rule };
