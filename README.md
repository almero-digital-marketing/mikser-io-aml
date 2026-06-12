# mikser-io-aml

ArchieML plugin for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Parses entities with `format: 'aml'` using [archieml](https://www.npmjs.com/package/archieml) and merges the result into `entity.meta`.

ArchieML is the format the *New York Times* and *ProPublica* use for journalist-friendly structured content — comment-tolerant, indentation-loose, easy to write inside a Google Doc and paste back. Reach for this plugin when the people authoring content aren't developers and `.yml` front-matter is too strict about syntax.

## Install

```bash
npm install mikser-io-aml
```

## Usage

```js
// mikser.config.js
import { aml } from 'mikser-io-aml'

export default {
  plugins: [aml()]
}
```

Any entity with `entity.format === 'aml'` and a `content` field will be parsed; the parsed object is assigned onto `entity.meta` and the raw `content` is dropped.

## License

MIT
