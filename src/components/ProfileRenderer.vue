<script setup lang="ts">
import { computed, nextTick, ref, toRaw, useTemplateRef, watch } from 'vue'
import AtProfile from '@/models/atprofile'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { getPds } from '@/stores/agent'

const props = defineProps<{
    profile: ProfileViewDetailed
    atProfile: AtProfile
}>()

const $iframe = useTemplateRef<HTMLIFrameElement>('$iframe')

const context = computed(() => ({
    profile: toRaw(props.profile),
    contextItems: toRaw(props.atProfile.context),
    newlinesToLinebreaks: toRaw(props.atProfile.newlinesToLinebreaks),
}))

const init = async () => {
    $iframe.value?.contentWindow?.postMessage(
        {
            action: 'setContent',
            payload: {
                context: toRaw({
                    ...context.value,
                    pds: await getPds(props.profile.did),
                }),
                content: toRaw(props.atProfile.content),
            },
        },
        '*',
    )
}

const isResetting = ref(false)

const reset = () => {
    isResetting.value = true
    nextTick(() => {
        isResetting.value = false
    })
}

watch(props, reset)
</script>
<template>
    <iframe
        v-if="!isResetting"
        ref="$iframe"
        :onload="init"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        src="/index-iframe.html"
    ></iframe>
</template>
