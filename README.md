# mikser-io-aml

ArchieML plugin for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Parses entities with `format: 'aml'` using [archieml](https://www.npmjs.com/package/archieml) and merges the result into `entity.meta`.

## Install

```bash
npm install mikser-io-aml
```

## Usage

```js
// mikser.config.js
export default {
  plugins: ['aml']
}
```

Any entity with `entity.format === 'aml'` and a `content` field will be parsed; the parsed object is assigned onto `entity.meta` and the raw `content` is dropped.

## License

MIT
