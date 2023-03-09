// This file is here as a workaround for catalyst scripts; it enables building all the files for testing, but it's not
// used to anything that's actuall shipped with the package.
import * as cli from './cli'
import * as lib from './lib'

if (lib === cli) throw new Error('Wut?')
