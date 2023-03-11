/* global describe expect test */
import { formatTerminalText } from '../format-terminal-text'

describe('formatTerminalText', () => {
  describe('semantic formatting', () => {
    const semanticText = 'Hi! <em>Test<rst> there.'
    const terminalTextDefault = formatTerminalText(semanticText)
    const terminalTextDark = formatTerminalText(semanticText, { style : 'dark' })
    const terminalTextLight = formatTerminalText(semanticText, { style : 'light' })

    test.each([
      ['default', terminalTextDefault],
      ['dark', terminalTextDark],
      ['light', terminalTextLight]
    ])("supports '%s' style", (style, fText) => {
      expect(fText).toMatch(/\x1b\[[^m]+m.*\x1b\[0m/) // eslint-disable-line no-control-regex
    })

    test('defaults to dark style', () => expect(terminalTextDefault === terminalTextDark).toBe(true))

    test('dark and light styles differ', () => expect(terminalTextDark !== terminalTextLight).toBe(true))

    test('supports escaping formatting tags', () => {
      const escText = 'Hi! \\<em>Test text\\<rst> there.'
      const deEscText = 'Hi! <em>Test text<rst> there.'
      const fText = formatTerminalText(escText)
      expect(fText).toBe(deEscText)
    })
  })

  describe('256 extended XTerm colors formatting', () => {
    test('processes foreground colors', () => {
      const ansiFgText = 'Hi! <fx:118>Test text<rst> there.'
      const fText = formatTerminalText(ansiFgText)
      expect(fText).toMatch(/Hi! \x1b\[38;5;118mTest text\x1b\[0m there/) // eslint-disable-line no-control-regex
    })

    test('processes background colors', () => {
      const ansiBgText = 'Hi! <bx:230>Test text<rst> there.'
      const fText = formatTerminalText(ansiBgText)
      expect(fText).toMatch(/Hi! \x1b\[48;5;230mTest text\x1b\[0m there/) // eslint-disable-line no-control-regex
    })

    test('supports escaping formatting tags', () => {
      const escText = 'Hi! \\<fac:118>Test text\\<rst> there.'
      const deEscText = 'Hi! <fac:118>Test text<rst> there.'
      const fText = formatTerminalText(escText)
      expect(fText).toBe(deEscText)
    })
  })

  describe('16.8M RGB color support', () => {
    test('processes foreground colors', () => {
      const rgbFgText = 'Hi! <frgb:3.6.9>Test text<rst> there.'
      const fText = formatTerminalText(rgbFgText)
      expect(fText).toMatch(/Hi! \x1b\[38;2;3;6;9mTest text\x1b\[0m there/) // eslint-disable-line no-control-regex
    })

    test('processes background colors', () => {
      const rgbBgText = 'Hi! <brgb:200.205.210>Test text<rst> there.'
      const fText = formatTerminalText(rgbBgText)
      // eslint-disable-next-line no-control-regex
      expect(fText).toMatch(/Hi! \x1b\[48;2;200;205;210mTest text\x1b\[0m there/)
    })

    test('supports escaping formatting tags', () => {
      const escText = 'Hi! \\<frgb:118.202.53>Test text\\<rst> there.'
      const deEscText = 'Hi! <frgb:118.202.53>Test text<rst> there.'
      const fText = formatTerminalText(escText)
      expect(fText).toBe(deEscText)
    })
  })
})
