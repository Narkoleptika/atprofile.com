<script setup lang="ts">
import { computed, nextTick, ref, toRaw, useTemplateRef, watch } from 'vue'
import AtProfile from '@/models/atprofile'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { getRecord, getRecords } from '@/stores/atproto'
import { lexToJson } from '@atproto/lexicon'

const props = defineProps<{
    profile: ProfileViewDetailed
    atProfile: AtProfile
}>()

const $iframe = useTemplateRef<HTMLIFrameElement>('$iframe')

const context = computed(() => ({
    profile: toRaw(props.profile),
    newlinesToLinebreaks: toRaw(props.atProfile.newlinesToLinebreaks),
}))

const init = async () => {
    const contextData = await Promise.all(
        props.atProfile.context.map(async (item) => {
            const did = props.profile.did
            const collection = item.collection
            const data = item.rkey
                ? getRecord(did, collection, item.rkey)
                : getRecords(did, collection, item.limit || 50)

            return [item.name, lexToJson(await data)]
        }),
    )

    $iframe.value?.contentWindow?.postMessage(
        {
            action: 'setContent',
            payload: {
                context: toRaw({
                    ...Object.fromEntries(contextData),
                    ...context.value,
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
