import test from 'ava'
import { fixture, read, start } from './helpers'

const { loader, file } = fixture('json')

test('read json directly', async (t) => {
  let mfs3 = await start({
    entry: {
      main: [
        'json-loader',
        '!',
        file('z.json'),
      ].join(''),
    },
  }, 3)
  let mfs4 = await start({
    entry: {
      main: [
        file('z.json'),
      ].join(''),
    },
  }, 4)
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nmodule.exports = {"name":"Z"}\n'), output3)
  t.true(output4.includes('\nmodule.exports = {"name":"Z"};\n'), output4)

  t.pass()
})

test('read json with loaders', async (t) => {
  let mfs3 = await start({
    entry: [
      loader('d.js'),
      '!',
      'json-loader',
      '!',
      file('z.json'),
    ].join(''),
  }, 3)
  let mfs4 = await start({
    entry: [
      loader('d.js'),
      '!',
      file('z.json'),
    ].join(''),
  }, 4)
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nmodule.exports = {"name":"Z"};"D"\n'), output3)
  
  /**
   * BREAK HERE
   * 
   * ```
   * !(function webpackMissingModule() { var e = new Error("Cannot find module '/tmp/test/fixtures/json/loaders/d.js!raw-loader!/tmp/test/fixtures/json/files/z.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());␊
   * ```
   */
  t.false(output4.includes('\nmodule.exports = {"name":"Z"};"D"\n'))

  t.pass()
})

test('read json with raw loader and one extra loader', async (t) => {
  let mfs3 = await start({
    entry: [
      loader('d.js'),
      '!',
      'raw-loader',
      '!',
      file('z.json'),
    ].join(''),
  }, 3)
  let mfs4 = await start({
    entry: [
      loader('d.js'),
      '!',
      'raw-loader',
      '!',
      file('z.json'),
    ].join(''),
  }, 4)
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nmodule.exports = "{\\n  \\"name\\": \\"Z\\"\\n}";"D"\n'), output3)

  /**
   * BREAK HERE
   * 
   * ```
   * !(function webpackMissingModule() { var e = new Error("Cannot find module '/tmp/test/fixtures/json/loaders/d.js!raw-loader!/tmp/test/fixtures/json/files/z.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());␊
   * ```
   */
  t.false(output4.includes('\nmodule.exports = "{\\n  \\"name\\": \\"Z\\"\\n}";"D"\n'))

  t.pass()
})

test('read json with raw loader and more than one extra loaders', async (t) => {
  let mfs3 = await start({
    entry: [
      loader('c.js'),
      '!',
      loader('d.js'),
      '!',
      'raw-loader',
      '!',
      file('z.json'),
    ].join(''),
  }, 3)
  let mfs4 = await start({
    entry: [
      loader('c.js'),
      '!',
      loader('d.js'),
      '!',
      'raw-loader',
      '!',
      file('z.json'),
    ].join(''),
  }, 4)
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nmodule.exports = "{\\n  \\"name\\": \\"Z\\"\\n}";"D";"C"\n'), output3)

  /**
   * BREAK HERE
   * 
   * ```
   * !(function webpackMissingModule() { var e = new Error("Cannot find module '/tmp/test/fixtures/json/loaders/d.js!raw-loader!/tmp/test/fixtures/json/files/z.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());␊
   * ```
   */
  t.false(output4.includes('\nmodule.exports = "{\\n  \\"name\\": \\"Z\\"\\n}";"D";"C"\n'))

  t.pass()
})