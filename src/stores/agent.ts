import { Agent } from '@atproto/api'
import { isLoggedIn, oathSession } from '@/stores/auth'
import { ref, watch } from 'vue'
import { DidDocument } from '@atproto/oauth-client-browser'

const initAgent = () => new Agent(oathSession.value?.session || 'https://public.api.bsky.app')

const didPdsCache: Record<string, string> = {}
const didDocCache: Record<string, DidDocument> = {}

const getPds = async (did: string) => {
    if (did in didPdsCache) {
        return didPdsCache[did]
    }

    const response = await fetch(
        did.startsWith('did:web')
            ? `https://${did.split(':')[2]}/.well-known/did.json`
            : 'https://plc.directory/' + did,
    )

    const doc: DidDocument = await response.json()

    if (!doc.service) {
        return
    }

    for (const service of doc.service) {
        if (service.id === '#atproto_pds') {
            didPdsCache[did] = service.serviceEndpoint.toString()
            didDocCache[did] = doc

            return service.serviceEndpoint.toString()
        }
    }
}

export const agent = ref(initAgent())

export const getPdsAgent = async (did: string) => {
    const pds = await getPds(did)

    if (!pds) {
        return agent.value
    }

    return new Agent(pds)
}

watch(isLoggedIn, async () => {
    agent.value = await initAgent()
})
