const { FuseBox, BabelPlugin, WebIndexPlugin, CSSPlugin, Sparky, QuantumPlugin } = require("fuse-box")
const { src, context, task } = require("fuse-box/sparky")
const fs = require('fs')

const SRC_PATH = 'src/'
const ENTRY = 'index.jsx'
const BUILD_PATH = 'build/'
const BUNDLE = 'bundle'
const DEV_PORT = 3333

// const SSL_KEY = fs.readFileSync('.keystore/debug.key', 'utf8')
// const SSL_CERT = fs.readFileSync('.keystore/debug.crt', 'utf8')
// const SSL_PASSWORD = 'password'

let fuse

// context shared between tasks
context(
  class {
    getOptions() {
      return {
        homeDir: SRC_PATH,
        output: `${BUILD_PATH}\$name.js`,
        sourceMaps: !this.isProduction,
        allowSyntheticDefaultImports: true,
        target: 'browser@es5',
        useTypescriptCompiler : true,
        definedExpressions: {
          "__isBrowser__": true,
        },
        plugins: [
          CSSPlugin(),
          WebIndexPlugin({
            template: `${SRC_PATH}templates/index.html`,
          }),
        ],
      }
    }
  }
)

// clean task
task('clean', context =>  {
  return src(BUILD_PATH).clean(BUILD_PATH).exec()
})

// config task
const config = (isProduction) => {
  return context => {
    context.isProduction = isProduction
    fuse = FuseBox.init(context.getOptions())
    if(!isProduction) {
      fuse.dev({
        port: DEV_PORT,
        // https: {
        //   key: SSL_KEY,
        //   cert: SSL_CERT,
        //   passphrase: SSL_PASSWORD
        // },
      })
    }
  }
}
// set isProduction on context if non-dev build
task('dev:config', config(false))
task('build:config', config(true))

// client task
task('client', context =>  {
  fuse.opts = context.getOptions()

  const client = fuse.bundle(BUNDLE)

  if(!context.isProduction) {
    client
      .watch([
        `${SRC_PATH}**`,
      ].join('|'))
      .hmr()
  }
  client.instructions(` > ${ENTRY}`)
  return client
})

const run = context => {
  fuse.run()
}

task('dev', ['clean', 'dev:config', 'client'], run)
task('build', ['clean', 'build:config', 'client'], run)
