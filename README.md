# @maji/config.js

[![CircleCI](https://circleci.com/gh/majisoftware/config.js.svg?style=svg)](https://circleci.com/gh/majisoftware/config.js)

> The JavaScript solution for dynamic configuration by [Maji](https://maji.cloud/).

Make sure you have a [Maji Config](https://maji.cloud/products/config) account.

## Usage

First, install the package. We recommend using [Yarn](https://yarnpkg.com/):

```
$ yarn add @maji/config.js
```

Next, create your config instance with your API key:

```js
import MajiConfig from '@maji/config.js'

const config = new MajiConfig({
  apiKey: 'YOUR API KEY'
})
```

Once you've created your config instance, it needs to fetch its initial data. This operation is required to be run before you attempt to retrieve any config values.

```js
config.prepare().then(() => {
  // start your application
}).catch(err => {
  // handle the exception
})
```

## Example

A simple example of bootstrapping Maji Config with a React application.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import MajiConfig from '@maji/config.js'
import App from './components/App'
import ErrorPage from './components/ErrorPage'

const config = new MajiConfig({ apiKey: 'XXX' })
config.prepare().then(() => {
  ReactDOM.render(<App config={config} />, document.getElementById('root'))
})
```
