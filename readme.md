# import-esm

[![Build Status][github_actions_badge]][github_actions_link]
[![Codecov][codecov_badge]][codecov_link]
[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]

[github_actions_badge]: https://img.shields.io/github/workflow/status/fisker/import-esm/CI/master?style=flat-square
[github_actions_link]: https://github.com/fisker/import-esm/actions?query=branch%3Amaster
[codecov_badge]: https://img.shields.io/codecov/c/github/fisker/import-esm/master?style=flat-square
[codecov_link]: https://codecov.io/gh/fisker/import-esm/branch/master
[license_badge]: https://img.shields.io/npm/l/import-esm.svg?style=flat-square
[license_link]: https://github.com/fisker/import-esm/blob/master/license
[package_version_badge]: https://img.shields.io/npm/v/import-esm.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/import-esm

> Import ECMAScript modules in the safe way

## Motivation

ECMAScript modules are [the official standard format](https://tc39.es/ecma262/#sec-modules) to package JavaScript code for reuse.

Static import is supported since [`Node.js@8.5.0`](https://nodejs.org/en/blog/release/v8.5.0/), you can't use `import foo from 'foo'` on `Node.js@<8.5.0`.

Dynamic import is supported since [`Node.js@9.6.0`](https://nodejs.org/en/blog/release/v9.6.0/), which means we will get an SyntaxError like: `SyntaxError: Unexpected token import` on `Node.js@<9.6.0` if you use code like `import(url)`. And you can't avoid this by putting `import(url)` in a `try/catch` block.

## Install

```bash
yarn add import-esm

# or

npm install import-esm
```

## Usage

```js
const importEsm = require('import-esm')

;(async () => {
  try {
    console.log(await importEsm('./foo.mjs'))
    // If your engine support ECMAScript Modules
    //=> [Module] { ... }
  } catch (error) {
    console.error(error)
    // If your engine doesn't support ECMAScript Modules
    //=> Error: ECMAScript Modules are not supported. ...
  }
})()
```

## API

### importEsm(url)

Import a `Module` from `url`.

Returns a `Promise<Module>`.

#### `url`

Type: `string`

The module url you want import.

### importEsm.check()

Check the ECMAScript Modules support.

Returns a `Promise<boolean>`.

```js
const importEsm = require('import-esm')

;(async () => {
  console.log(await importEsm.check())
  //=> true
})()
```

### importEsm.checkSync()

The cached result of ECMAScript Modules support check.

Returns a `boolean | ''`.

**Note**: Since there is no sync way to detect ECMAScript Modules support, this method returns `''` (empty string), if we don't know support result yet. \*\*

To get the real result, you have to compare `importEsm.checkSync()` with `boolean`

```js
const importEsm = require('import-esm')

const isEsmSupported = importEsm.checkSync()

if (isEsmSupported === true) {
  // ECMAScript Modules are supported.
} else if (isEsmSupported === false) {
  // ECMAScript Modules are not supported.
} else {
  // We don't know yet.
}
```

This method is design for easier use in case like this:

```js
const importEsm = require('import-esm')

const importModule = async (url) => {
  try {
    return await importEsm(url)
  } catch (error) {
    // Runs on every time
    handleNonSupportedError(error)
  }
}

const importModule = async (url) => {
  if (importEsm.checkSync()) {
    // Please make sure your engine knows `import()` syntax
    return import(url)
  }

  try {
    return await importEsm(url)
  } catch (error) {
    // Runs only if we don't know support result yet
    handleNonSupportedError(error)
  }
}
```

## Known Issue(s)

- On `Node.js@<=0.10`, you need polyfill `Promise` yourself.
- ESM support in Node.js is experimental, though enabled by default in Node.js 13. _You will see messages like `ExperimentalWarning: The ESM module loader is experimental` in console. These are emitted by Node.js, not from this module._
