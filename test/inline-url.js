import test from 'ava'
import { fixture, read, start } from './helpers'

const { loader, file } = fixture('inline-url')

test('use loaders 1', async (t) => {
  let [ mfs3, mfs4 ] = await start({
    entry: [
      loader('a'),
      '!',
      loader('b'),
      '!',
      loader('c'),
      '!',
      loader('d'),
      '!',
      file('z.txt'),
    ].join(''),
  }, [3, 4])

  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nZDCBA\n'), output3)
  t.true(output4.includes('\nZDCBA\n'), output4)

  t.pass()
})

test('use loaders 2', async (t) => {
  let [ mfs3, mfs4 ] = await start({
    entry: [
      '!',
      loader('a'),
      '!',
      loader('b'),
      '!',
      loader('c'),
      '!',
      loader('d'),
      '!',
      file('z.txt'),
    ].join(''),
  }, [3, 4])
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nZDCBA\n'), output3)
  t.true(output4.includes('\nZDCBA\n'), output4)

  t.pass()
})

test('use loaders 2', async (t) => {
  let [ mfs3, mfs4 ] = await start({
    entry: [
      '!',
      loader('a'),
      '!!',
      loader('b'),
      '!!!!',
      loader('c'),
      '!!',
      loader('d'),
      '!',
      file('z.txt'),
    ].join(''),
  }, [3, 4])
  let [ output3, output4 ] = read([mfs3, mfs4])

  t.true(output3.includes('\nZDCBA\n'), output3)
  t.true(output4.includes('\nZDCBA\n'), output4)

  t.pass()
})
