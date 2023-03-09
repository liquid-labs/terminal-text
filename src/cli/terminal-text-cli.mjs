import { existsSync } from 'node:fs'

import createError from 'http-errors'

const filePath = process.argv[2]
if (filePath !== undefined) {
  // read from file
  if (!existsSync(filePath)) {
    throw createError.NotFound(`Did not find file '${filePath}'.`)
  } // else, good to go
}