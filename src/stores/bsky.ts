import { agent } from '@/stores/agent'
import { ref, watch } from 'vue'
import { isLoggedIn, oathSession } from '@/stores/auth'

export const resolveHandle = async (handle: string) => {
    const {
        data: { did },
    } = await agent.value.resolveHandle({ handle })

    return did
}

export const getProfile = async (did: string) => {
    const { data } = await agent.value.getProfile({
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
