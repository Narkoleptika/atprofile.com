import { BrowserOAuthClient, clientMetadataSchema } from '@atproto/oauth-client-browser'
import clientMetadataJsonUrl from '/client-metadata.json?url'
import { computed, ref } from 'vue'

const clientMetadataJson = await (await fetch(clientMetadataJsonUrl)).json()
const enc = encodeURIComponent
const clientMetadata = clientMetadataSchema.parse(clientMetadataJson)

const client = new BrowserOAuthClient({
    handleResolver: 'https://bsky.social',
    responseMode: 'query',
    clientMetadata: {
        ...clientMetadata,
        /* eslint-disable camelcase */
        client_id: import.meta.env.PROD
            ? clientMetadata.client_id
            : `http://localhost?redirect_uri=${enc(`http://127.0.0.1:5173/`)}&scope=${enc('atproto transition:generic')}`,

        redirect_uris: import.meta.env.PROD ? clientMetadata.redirect_uris : ['http://127.0.0.1:5173/'],
        /* eslint-enable camelcase */
    },
})

export const oathSession = ref(await client.init())

client.addEventListener('deleted', () => {
    // eslint-disable-next-line no-undefined
    oathSession.value = undefined
})

export const isLoggedIn = computed(() => Boolean(oathSession.value))

export const login = async (handle: string) => {
    try {
        await client.signIn(handle, {
            prompt: 'none',
        })
    } catch (error) {
        console.error(error)
        await client.signIn(handle)
    }
}

export const logout = async () => {
    if (!oathSession.value) {
        return
    }
    try {
        await client.revoke(oathSession.value.session.sub)
    } catch (error) {
        console.error(error)
    }
}
