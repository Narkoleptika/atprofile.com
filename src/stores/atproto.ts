import { getPdsAgent } from '@/stores/agent'
import { OutputSchema as GetRecordSchema } from '@atproto/api/dist/client/types/com/atproto/repo/getRecord'
import { OutputSchema as ListRecordsSchema } from '@atproto/api/dist/client/types/com/atproto/repo/listRecords'

const recordCache: Record<string, GetRecordSchema['value']> = {}
const recordsCache: Record<string, ListRecordsSchema['records'][number]['value']> = {}

export const getRecord = async (did: string, collection: string, rkey: string = 'self') => {
    const cacheKey = `${did}-${collection}`

    if (recordCache[cacheKey]) {
        return recordCache[cacheKey]
    }

    const agent = await getPdsAgent(did)
    const { data } = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection,
        rkey,
    })

    recordCache[cacheKey] = data.value

    return recordCache[cacheKey]
}

export const getRecords = async (did: string, collection: string, limit: number) => {
    const cacheKey = `${did}-${collection}-${limit}`

    if (recordsCache[cacheKey]) {
        return recordsCache[cacheKey]
    }

    const agent = await getPdsAgent(did)

    const { data } = await agent.com.atproto.repo.listRecords({
        repo: did,
        collection,
        limit,
    })

    recordsCache[cacheKey] = data.records.map(({ value }) => value)

    return recordsCache[cacheKey]
}
