import co from 'co'
import path from 'path'
import compiler from './compiler'

function resolve (filePath) {
  return path.resolve(__dirname, '../fixtures', filePath)
}

export function fixture (namespace) {
  return {
    loader: (name) => resolve(`${namespace}/loaders/${name}`),
    file: (name) => resolve(`${namespace}/files/${name}`),
  }
}

export function read (fs, file = '/output') {
  if (Array.isArray(fs)) {
    return fs.map((f) => read(f, file))
  }

  return fs.readFileSync(file, 'utf8')
}

export async function start (webpackConfigure, webpackVersion) {
  if (Array.isArray(webpackVersion)) {
    return co(function *() {
      return yield webpackVersion.map(async (version) => {
        return await start(webpackConfigure, version)
      })
    })
  }

  let { mfs, compile } = compiler(webpackConfigure, webpackVersion)
  await compile()
  return mfs
}
