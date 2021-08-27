import json from '@rollup/plugin-json'
import commonJS from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

const BUILD_MODES = new Set(['development', 'production'])
const extensions = ['.js', '.ts', '.json']

function createRollupConfig({ mode, format, input, pkg, config }) {
  if (!BUILD_MODES.has(mode)) {
    throw new Error(`The Rollup configuration ${JSON.stringify(mode)} mode is not supported.`)
  }

  const bundles = []

  if (format === 'cjs') {
    bundles.push({
      ...config,
      input: '../../scripts/rollup/cjs.js',
      output: {
        file: `dist/cjs/${input}.js`,
        format,
        sourcemap: false,
        ...config.output,
      },
      plugins: [
        replace({
          preventAssignment: false,
          delimiters: ['', ''],
          values: {
            __BUNDLE__: input,
          },
        }),
        json(),
        resolve({
          extensions,
        }),
        babel({
          exclude: 'node_modules/**',
          extensions,
          rootMode: 'upward',
        }),
        filesize({
          showMinifiedSize: false,
          showGzippedSize: true,
        }),
        ...(config.plugins || []),
      ].filter(Boolean),
    })
  }

  bundles.push({
    ...config,
    input: `src/${input}.ts`,
    output: {
      file: `dist/${format}/${input}.${mode}.js`,
      format,
      sourcemap: true,
      name: pkg.name === 'tordo.js' ? pkg.name : pkg.name.replace('.', ''),
      // banner: getBundleBanner(pkg),
      ...config.output,
    },
    plugins: [
      replace({
        preventAssignment: false,
        delimiters: ['', ''],
        values: {
          'process.env.NODE_ENV': JSON.stringify(mode),
          '@tordojs': '@tordo.js',
        },
      }),
      json(),
      resolve({
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        rootMode: 'upward',
      }),
      commonJS(),
      mode === 'production' && terser(),
      filesize({
        showMinifiedSize: false,
        showGzippedSize: true,
      }),
      ...(config.plugins || []),
    ].filter(Boolean),
  })

  return bundles
}

export function createRollupConfigs({ pkg, inputs = ['index'], config = {} }) {
  config = {
    ...config,
    onwarn(warning, warn) {
      //console.debug('warning', warning);
      if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('node_modules/luxon')) {
        return
      }
      warn(warning)
    },
  }
  return inputs
    .map((input) => {
      return [
        createRollupConfig({
          mode: 'development',
          format: 'umd',
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: 'production',
          format: 'umd',
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: 'development',
          format: 'cjs',
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: 'production',
          format: 'cjs',
          input,
          pkg,
          config,
        }),
      ]
    })
    .flat(2)
}
