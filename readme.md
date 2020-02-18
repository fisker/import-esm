# import-esm

> Import ES Module in the safe way

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

## Known Issue(s)

On `Node.js@<=0.10`, you need polyfill `Promise` yourself.
