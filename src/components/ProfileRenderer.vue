<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, toRaw, watch } from 'vue'
import { getProfile, resolveHandle } from '@/stores/bsky'
import defaultProfile from '@/assets/text/default-profile.txt?raw'

const emit = defineEmits<{
    'not-found': []
}>()
const props = withDefaults(
    defineProps<{
        handle: string
        shouldReplaceTokens?: boolean
        newlinesToLinebreaks?: boolean
        content?: string
    }>(),
    {
        shouldReplaceTokens: true,
        newlinesToLinebreaks: false,
    },
)
const $iframe = ref<HTMLIFrameElement>()
const profile = ref<Awaited<ReturnType<typeof getProfile>>>()
const content = computed(() => props.content || defaultProfile)
const context = computed(() => ({
    profile: toRaw(profile.value),
    shouldReplaceTokens: toRaw(props.shouldReplaceTokens),
    newlinesToLinebreaks: toRaw(props.newlinesToLinebreaks),
}))

const update = () => {
    $iframe.value?.contentWindow?.postMessage(
        {
            action: 'setContent',
            payload: {
                context: toRaw(context.value),
                content: toRaw(content.value),
            },
        },
        '*',
    )
}

const fetchProfile = async () => {
    try {
        profile.value = await getProfile(await resolveHandle(props.handle))
        update()
    } catch (error) {
        console.error(error)
        emit('not-found')
    }
}

watch(() => props.handle, fetchProfile)
watch([content, context], update)
onMounted(fetchProfile)
onUpdated(update)
</script>
<template>
    <iframe
        :key="handle"
        ref="$iframe"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        src="/index-iframe.html"
    ></iframe>
</template>
