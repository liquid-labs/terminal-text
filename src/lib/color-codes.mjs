import { extendedXterm } from './extended-xterm'

const validStyles = ['dark', 'light', 'greenOnBlack']

// https://misc.flogisoft.com/bash/tip_colors_and_formatting
// for testing:
// function colors() { local i=1; while (( $i <= $# )); do printf "\e[48;5;${!i}m "; i=$(( $i + 1 )); done; printf "\e[0m\n"; }
// then: colors 11 220 8

const modifiers = { // basic non-color / functional codes
  rst        : { '*' : '\x1b[0m' },
  bright     : { '*' : '\x1b[1m' },
  bold       : { '*' : '\x1b[1m' }, // bold and bright are aliases
  dim        : { '*' : '\x1b[2m' },
  underscore : { '*' : '\x1b[4m' },
  underline  : { '*' : '\x1b[4m' },
  blink      : { '*' : '\x1b[5m' },
  inverse    : { '*' : '\x1b[7m' },
  hidden     : { '*' : '\x1b[8m' }
}

const semantic = {
  // semantic codes
  h1 : {
    greenOnBlack : '\x1b[30m\x1b[48;5;226m'/* black on yellow1 bg */,
    dark         : '\x1b[30m\x1b[48;5;226m'/* black on yellow1 bg */,
    light        : '\x1b[30m\x1b[48;5;10m'/* black on lime bg */
  },
  h2 : {
    greenOnBlack : '\x1b[38;5;226m\x1b[4m'/* yellow1 + underscore */,
    dark         : '\x1b[38;5;226m\x1b[4m',
    light        : '\x1b[92m\x1b[4m' /* bright green + underscore */
  },
  h3 : {
    greenOnBlack : '\x1b[38;5;226m'/* canary yellow */,
    dark         : '\x1b[38;5;226m',
    light        : '\x1b[92m' /* bright green */
  },
  code   : { greenOnBlack : '\x1b[37m'/* light grey */, dark : '\x1b[37m', light : '\x1b[90m'/* dark grey */ },
  danger : { '*' : '\x1b[97m\x1b[41m'/* white on bright red bg */ },
  em     : { greenOnBlack : '\x1b[96m'/* magenta */, dark : '\x1b[96m', light : '\x1b[95m'/* bright magenta */ },
  error  : { greenOnBlack : '\x1b[91m'/* bright red */, dark : '\x1b[91m', light : '\x1b[31m'/* red */ },
  warn   : {
    greenOnBlack : '\x1b[38;5;214m'/* orange */,
    dark         : '\x1b[38;5;214m',
    light        : '\x1b[63m'/* yellow/gold */
  },
  // alias for 'warn'
  warning : {
    greenOnBlack : '\x1b[93m'/* bright yellow/gold */,
    dark         : '\x1b[93m',
    light        : '\x1b[63m'/* yellow/gold */
  }
}

const standardXterm = {
  // standard foreground colors
  black    : { '*' : '\x1b[30m' },
  maroon   : { '*' : '\x1b[31m' },
  green    : { '*' : '\x1b[32m' },
  olive    : { '*' : '\x1b[33m' },
  navy     : { '*' : '\x1b[34m' },
  purple   : { '*' : '\x1b[35m' },
  teal     : { '*' : '\x1b[36m' },
  silver   : { '*' : '\x1b[37m' },
  // standard background colors
  bgBlack  : { '*' : '\x1b[40m' },
  bgMaroon : { '*' : '\x1b[41m' },
  bgGreen  : { '*' : '\x1b[42m' },
  bgOlive  : { '*' : '\x1b[43m' },
  bgNavy   : { '*' : '\x1b[44m' },
  bgPurple : { '*' : '\x1b[45m' },
  bgTeal   : { '*' : '\x1b[46m' },
  bgSilver : { '*' : '\x1b[47m' }
}

const brightStandardXterm = {
  // standard bright colors; these are the same as 'bright'/'bold' + standard color
  grey      : { '*' : '\x1b[90m' }, // 'bright black == grey'
  red       : { '*' : '\x1b[91m' },
  lime      : { '*' : '\x1b[92m' },
  yellow    : { '*' : '\x1b[93m' },
  blue      : { '*' : '\x1b[94m' },
  fuschia   : { '*' : '\x1b[95m' },
  aqua      : { '*' : '\x1b[96m' },
  white     : { '*' : '\x1b[97m' }, // 'bright grey == white'
  // bright backgrounds
  bgGrey    : { '*' : '\x1b[100m' },
  bgRed     : { '*' : '\x1b[101m' },
  bgLime    : { '*' : '\x1b[102m' },
  bgYellow  : { '*' : '\x1b[103m' },
  bgBlue    : { '*' : '\x1b[104m' },
  bgFuschia : { '*' : '\x1b[105m' },
  bgAqua    : { '*' : '\x1b[106m' },
  bgWhite   : { '*' : '\x1b[107m' }
}

const colorCodes = {
  ...modifiers,
  ...semantic,
  ...standardXterm,
  ...brightStandardXterm,
  ...extendedXterm
}

export { colorCodes, validStyles }
