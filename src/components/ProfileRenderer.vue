<script setup lang="ts">
import { computed, onUpdated, ref, toRaw, watch } from 'vue'
import AtProfile from '@/models/atprofile'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { getRecord, getRecords } from '@/stores/atproto'

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

const update = async () => {
    const contextData = await Promise.all(
        props.atProfile.context.map(async (item) => {
            const did = props.profile.did
            const collection = item.collection
            const data = item.rkey
                ? getRecord(did, collection, item.rkey)
                : getRecords(did, collection, item.limit || 50)

            return [item.name, await data]
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
