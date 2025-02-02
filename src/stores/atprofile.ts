import AtProfile, { defaultAtProfile } from '@/models/atprofile'
import { agent, getPdsAgent } from '@/stores/agent'
import { ref, watch } from 'vue'
import { isLoggedIn, oathSession } from '@/stores/auth'

export const getAtProfile = async (did: string) => {
    try {
        const pdsAgent = await getPdsAgent(did)
        const { data } = await pdsAgent.com.atproto.repo.getRecord({
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
    await agent.value.com.atproto.repo.putRecord({
        repo: agent.value.assertDid,
        collection: defaultAtProfile.$type,
        rkey: 'self',
        record: atp,
    })

    userAtProfile.value = atp
}
