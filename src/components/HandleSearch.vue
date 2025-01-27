<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()
const handleInput = ref('')
const handle = computed({
    get: () => {
        if (handleInput.value) {
            return handleInput.value
        }

        if (Array.isArray(route.params.handle)) {
            return route.params.handle[0]
        }

        return route.params.handle
    },
    set: (value) => {
        handleInput.value = value
    },
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
            v-model="handle"
            placeholder="handle.bsky.social"
            required
        />

        <button class="btn px-3 btn-primary join-item">
            <MagnifyingGlassIcon class="-scale-x-100 w-5 fill-current" />
        </button>
    </form>
</template>
