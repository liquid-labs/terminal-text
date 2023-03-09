import { colorCodes } from './color-codes'

const formatTerminalText = (tText, { style = 'greenOnBlack' }) => {
  // TODO: find for now, but probably more efficient to extract the tags we need.
  for (const [key, styles] of Object.entries(colorCodes)) {
    const replacer = new RegExp('<' + key + '>', 'g')
    tText = tText.replaceAll(replacer, styles[style] || styles['*'])
  }
  // general color code support for ansi colors:
  tText = tText.replaceAll(/<fgc:(\d+)>/g, '\x1b[38;5;$1m')
  tText = tText.replaceAll(/<bgc:(\d+)>/g, '\x1b[48;5;$1m')
  // general support for RGB colors:
  tText = tText.replaceAll(/<frgb:(\d+).(\d+).(\d+)>/g, '\x1b[38;2;$1;$2;$3m')
  tText = tText.replaceAll(/<brgb:(\d+).(\d+).(\d+)>/g, '\x1b[48;2;$1;$2;$3m')

  return tText
}

export { formatTerminalText }
