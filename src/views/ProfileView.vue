<script setup lang="ts">
import ProfileRenderer from '@/components/ProfileRenderer.vue'
import AtProfile from '@/models/atprofile'
import { getAtProfile } from '@/stores/atprofile'
import { getProfile, resolveHandle } from '@/stores/bsky'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handle = computed(() => {
    const value = route.params.handle

    if (Array.isArray(value)) {
        return value[0]
    }

    return value
})

const profile = ref<ProfileViewDetailed>()
const atProfile = ref<AtProfile>()

const fetchProfile = async () => {
    try {
        const did = await resolveHandle(handle.value)
        const [prof, atprof] = await Promise.all([getProfile(did), getAtProfile(did)])

        profile.value = prof
        atProfile.value = atprof
    } catch (error) {
        console.error(error)
        router.push({
            name: 'not-found',
            params: { pathMatch: route.path.substring(1).split('/') },
            query: route.query,
            hash: route.hash,
        })
    }
}

watch(handle, async () => {
    await fetchProfile()
})
onMounted(async () => {
    await fetchProfile()
})
</script>
<template>
    <main class="flex flex-col">
        <ProfileRenderer
            :key="handle"
            v-if="profile && atProfile"
            :profile="profile"
            :at-profile="atProfile"
            class="flex-1"
        />
    </main>
</template>
