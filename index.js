import archieml from 'archieml'
import { probeFormat } from 'mikser-io'

// ArchieML's parser reports no positions, so `mikser_which` and anything else
// asking "where was this value written" would get a field path and no line.
//
// The engine's probe fills that in from the parser alone: substitute a token
// for each value, re-parse once, and read the position off wherever the token
// landed. Registered here rather than in core because core has no business
// knowing archieml exists — a format that ships in its own package ships its
// provenance with it.
//
// At module scope on purpose: it is a pure registration keyed on
// `entity.format`, it costs nothing until something asks for a position, and
// doing it in the factory would mean provenance depends on the plugin being
// configured rather than merely present.
probeFormat('aml', {
    test: (entity) => entity?.format === 'aml',
    parse: (text) => archieml.load(text),
})

export function aml(options = {}) {
    return ({
        onProcess,
        useLogger,
        useJournal,
        updateEntry,
        constants: { OPERATION },
    }) => {
        onProcess(async (signal) => {
            const logger = useLogger()

            for await (let { id, entity } of useJournal('Aml', [OPERATION.CREATE, OPERATION.UPDATE], signal)) {
                if (entity.content && entity.format == 'aml') {
                    entity.meta = Object.assign(entity.meta || {}, archieml.load(entity.content))
                    delete entity.content
                    await updateEntry({ id, entity })
                    logger.trace('ArchieML %s: %s', entity.collection, entity.id)
                }
            }
        })
    }
}
