import * as fs from 'node:fs/promises'

import createError from 'http-errors'

import { formatTerminalText } from '../lib/format-terminal-text'

const processString = (data, style) => {
  console.log(formatTerminalText(data, { style }))
}

const processFile = async(filePath, style) => {
  if (filePath === undefined) {
    throw createError.BadRequest('Pipe contents or provide file name.')
  }

  try {
    const data = await fs.readFile(filePath, { encoding : 'utf8' })
    processString(data, style)
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      throw createError.NotFound(`No such file '${filePath}' found.`, { source : e })
    }
    else {
      throw e
    }
  }
}

const processPipe = (style) => {
  let data = ''

  process.stdin.on('data', (chunk) => { data += chunk })

  process.stdin.on('end', () => processString(data, style))
}

const run = () => {
  let style = 'dark'

  const args = process.argv.slice(2)
  if (args[0] === '--style') {
    style = args[1]
    args.shift()
    args.shift()
  }

  if (process.stdin.isTTY) {
    processFile(args[0], style)
  }
  else {
    processPipe(style)
  }
}

export { run }
