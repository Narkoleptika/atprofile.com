import { Agent, AtpAgent } from '@atproto/api'
import { isLoggedIn, oathSession } from '@/stores/auth'
import { ref, watch } from 'vue'
import { DidDocument } from '@atproto/oauth-client-browser'

const initAgent = () => {
    if (oathSession.value) {
        return new Agent(oathSession.value.session)
    }

    return new AtpAgent({
        service: 'https://public.api.bsky.app',
    })
}

const didPDSCache: Record<string, string> = {}
const didDocCache: Record<string, DidDocument> = {}

const getPds = async (did: string) => {
    if (did in didPDSCache) {
        return didPDSCache[did]
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
            didPDSCache[did] = service.serviceEndpoint.toString()
            didDocCache[did] = doc

            return service.serviceEndpoint.toString()
        }
    }
}

const agent = ref(await initAgent())

export const getUserAgent = async (did?: string) => {
    if (isLoggedIn.value || !did) {
        return agent.value
    }

    const pds = await getPds(did)

    if (!pds) {
        return agent.value
    }

    return new AtpAgent({
        service: pds,
    })
}

watch(isLoggedIn, async () => {
    agent.value = await initAgent()
})
