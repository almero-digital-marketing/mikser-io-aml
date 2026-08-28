import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Importing the plugin registers its provenance handler as a side effect, so
// the import order here is the thing under test as much as the assertions are.
import '../index.js'
import { positionsForSource } from 'mikser-io'

describe('archieml provenance', () => {
    const RAW = `title: Контакти
[items]
label: Начало
href: /
label: Козметика
href: /cosmetics
[]
`
    const entity = {
        format: 'aml',
        meta: {
            title: 'Контакти',
            items: [
                { label: 'Начало', href: '/' },
                { label: 'Козметика', href: '/cosmetics' },
            ],
        },
    }

    it('locates every value, though archieml reports no ranges', () => {
        // The engine's probe supplies what the parser does not: substitute a
        // token per value, re-parse ONCE, and read the position off wherever
        // each token landed.
        const positions = positionsForSource(RAW, entity)
        assert.deepEqual(positions, {
            'title':          { line: 1, col: 7 },
            'items[0].label': { line: 3, col: 7 },
            'items[0].href':  { line: 4, col: 6 },
            'items[1].label': { line: 5, col: 7 },
            'items[1].href':  { line: 6, col: 6 },
        })
    })

    it('every position actually holds the value it claims', () => {
        const lines = RAW.split('\n')
        const positions = positionsForSource(RAW, entity)
        assert.equal(lines[positions['items[1].label'].line - 1].slice(positions['items[1].label'].col), 'Козметика')
        assert.equal(lines[positions['title'].line - 1].slice(positions['title'].col), 'Контакти')
    })

    it('leaves other formats to their own handlers', () => {
        // Registering for `aml` must not capture a yaml entity, or the probe
        // replaces a parser that already reports exact ranges.
        const positions = positionsForSource('title: X\n', { format: 'yml', meta: { title: 'X' } })
        assert.deepEqual(positions.title, { line: 1, col: 7 })
    })
})
