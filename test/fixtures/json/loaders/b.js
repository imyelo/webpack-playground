module.exports = function (source) {
  // hack for test
  let version = this.query.slice(1)

  /**
   *  forked from https://github.com/lingui/js-lingui/commit/f804335ce502cca65bdcab72f4b0021711fbf3b9
   * see:
   * - https://github.com/webpack/webpack/issues/7057#issuecomment-381883220
   * - https://github.com/webpack/webpack/issues/6572#issuecomment-374987270
   */
  let JavascriptGenerator, JavascriptParser
  try {
    JavascriptGenerator = require('webpack' + version + '/lib/JavascriptGenerator')
    JavascriptParser = require('webpack' + version + '/lib/Parser')
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error
    }
  }

  if (JavascriptGenerator && JavascriptParser && this._module.type !== 'javascript/auto') {
    this._module.type = 'javascript/auto'
    this._module.generator = new JavascriptGenerator()
    this._module.parser = new JavascriptParser()
  }
  return 'module.exports = ' + source + ';"BLACK MAGIC"'
}
