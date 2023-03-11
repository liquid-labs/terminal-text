import createError from 'http-errors'

import { colorCodes, validStyles } from './color-codes'

const formatTerminalText = (tText, { style = 'dark' } = {}) => {
  if (!validStyles.includes(style)) {
    throw createError.BadRequest(`Unknown style '${style}' specified.`)
  }

  // TODO: find for now, but probably more efficient to extract the tags we need.
  for (const [key, styles] of Object.entries(colorCodes)) {
    const replacer = new RegExp('(^|[^\\\\])<' + key + '>', 'g')
    tText = tText.replaceAll(replacer, '$1' + (styles[style] || styles['*']))
  }
  // general color code support for extended xterm colors:
  tText = tText.replaceAll(/(^|[^\\\\])<fx:(\d+)>/g, '$1\x1b[38;5;$2m')
  tText = tText.replaceAll(/(^|[^\\\\])<bx:(\d+)>/g, '$1\x1b[48;5;$2m')
  // general support for RGB colors:
  tText = tText.replaceAll(/(^|[^\\\\])<frgb:(\d+).(\d+).(\d+)>/g, '$1\x1b[38;2;$2;$3;$4m')
  tText = tText.replaceAll(/(^|[^\\\\])<brgb:(\d+).(\d+).(\d+)>/g, '$1\x1b[48;2;$2;$3;$4m')
  // finally, handle escaped tags
  tText = tText.replaceAll(/\\\\</g, '\\<')
  tText = tText.replaceAll(/\\</g, '<')

  return tText
}

export { formatTerminalText }
