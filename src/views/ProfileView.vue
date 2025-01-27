<script setup lang="ts">
import ProfileRenderer from '@/components/ProfileRenderer.vue'
import { computed } from 'vue'
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
</script>
<template>
    <main class="flex flex-col">
        <ProfileRenderer
            class="flex-1"
            :handle="handle"
            @not-found="
                router.push({
                    name: 'not-found',
                    params: { pathMatch: route.path.substring(1).split('/') },
                    query: route.query,
                    hash: route.hash,
                })
            "
        />
    </main>
</template>
