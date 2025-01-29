<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()
const isFocused = ref(false)
const handle = ref('')
const routeHandle = computed(() => {
    if (Array.isArray(route.params.handle)) {
        return route.params.handle[0]
    }

    return route.params.handle
})
const submit = () => {
    router.push({ name: 'profile', params: { handle: handle.value } })
    handle.value = ''
}
</script>
<template>
    <form class="join" @submit.prevent="submit">
        <input
            class="join-item input w-full"
            type="search"
            name="handle"
            @focus="isFocused = true"
            @blur="isFocused = false"
            v-model="handle"
            :placeholder="routeHandle || 'handle.bsky.social'"
            required
        />

        <button class="btn px-3 btn-primary join-item">
            <MagnifyingGlassIcon class="-scale-x-100 w-5 fill-current" />
        </button>
    </form>
</template>
