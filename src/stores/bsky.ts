import { getUserAgent } from '@/stores/agent'
import { ref, watch } from 'vue'
import { isLoggedIn, oathSession } from '@/stores/auth'

export const resolveHandle = async (handle: string) => {
    const agent = await getUserAgent()
    const {
        data: { did },
    } = await agent.resolveHandle({ handle })

    return did
}

export const getProfile = async (did: string) => {
    const agent = await getUserAgent()
    const { data } = await agent.getProfile({
        actor: did,
    })

    return data
}

const getUserProfile = async () => {
    if (!oathSession.value) {
        return
    }

    return getProfile(oathSession.value.session.sub)
}

export const userProfile = ref(await getUserProfile())

watch(isLoggedIn, async () => {
    userProfile.value = await getUserProfile()
})
