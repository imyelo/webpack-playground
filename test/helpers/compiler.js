import path from 'path'
import webpack3 from 'webpack3'
import webpack4 from 'webpack4'
import merge from 'webpack-merge'
import MemoryFS from 'memory-fs'

const root = path.resolve(__dirname, '..')

const webpack = {
  3: webpack3,
  4: webpack4,
}

export default (options = {}, webpackVersion = 4) => {
  const mfs = new MemoryFS()

  options = merge.smart(
    {
      context: root,
      output: {
        path: '/',
        publicPath: '/',
        filename: 'output',
      },
    },
    webpackVersion === 4 ? {
      mode: 'none',
    } : {},
    options,
  )

  return {
    mfs,
    compile() {
      const compiler = webpack[webpackVersion](options)
      compiler.outputFileSystem = mfs
      return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            reject(err)
          } else {
            resolve(stats)
          }
        })
      })
    },
  }
}
