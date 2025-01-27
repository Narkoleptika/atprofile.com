import AtProfile from '@/models/atprofile'
import { getUserAgent } from '@/stores/agent'
import { ref, watch } from 'vue'
import defaultContent from '@/assets/text/default-profile.txt?raw'
import { isLoggedIn, oathSession } from '@/stores/auth'

const defaultAtProfile = AtProfile.parse({
    content: defaultContent,
})

export const getAtProfile = async (did: string) => {
    try {
        const agent = await getUserAgent(did)
        const { data } = await agent.com.atproto.repo.getRecord({
            repo: did,
            collection: defaultAtProfile.$type,
            rkey: 'self',
        })

        return AtProfile.parse(data.value)
    } catch (error) {
        console.error(error)

        return defaultAtProfile
    }
}

const getUserAtProfile = async () => {
    if (!oathSession.value) {
        return defaultAtProfile
    }

    return getAtProfile(oathSession.value.session.sub)
}

export const userAtProfile = ref(await getUserAtProfile())

watch(isLoggedIn, async () => {
    userAtProfile.value = await getUserAtProfile()
})

export const putAtProfile = async (atp: AtProfile) => {
    const agent = await getUserAgent()

    await agent.com.atproto.repo.putRecord({
        repo: agent.assertDid,
        collection: defaultAtProfile.$type,
        rkey: 'self',
        record: atp,
    })

    userAtProfile.value = atp
}
