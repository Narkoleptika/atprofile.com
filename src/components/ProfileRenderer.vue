<script setup lang="ts">
import { computed, onUpdated, ref, toRaw, watch } from 'vue'
import AtProfile from '@/models/atprofile'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'

const props = defineProps<{
    profile: ProfileViewDetailed
    atProfile: AtProfile
}>()

const $iframe = ref<HTMLIFrameElement>()

const context = computed(() => ({
    profile: toRaw(props.profile),
    replaceTokens: toRaw(props.atProfile.replaceTokens),
    newlinesToLinebreaks: toRaw(props.atProfile.newlinesToLinebreaks),
}))

const update = () => {
    $iframe.value?.contentWindow?.postMessage(
        {
            action: 'setContent',
            payload: {
                context: toRaw(context.value),
                content: toRaw(props.atProfile.content),
            },
        },
        '*',
    )
}

watch(props, update)
onUpdated(update)
</script>
<template>
    <iframe
        ref="$iframe"
        :onload="update"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        src="/index-iframe.html"
    ></iframe>
</template>
