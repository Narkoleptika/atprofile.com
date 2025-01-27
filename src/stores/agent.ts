import { Agent, AtpAgent } from '@atproto/api'
import { isLoggedIn, oathSession } from '@/stores/auth'
import { ref, watch } from 'vue'

const initAgent = () => {
    if (oathSession.value) {
        return new Agent(oathSession.value.session)
    }

    return new AtpAgent({
        service: 'https://public.api.bsky.app',
    })
}

export const agent = ref(await initAgent())

watch(isLoggedIn, async () => {
    agent.value = await initAgent()
})
