<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
import ProfileRenderer from '@/components/ProfileRenderer.vue'
import { userProfile } from '@/stores/bsky'
import settings from '@/stores/settings'
import { computed } from 'vue'
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import { userAtProfile, putAtProfile } from '@/stores/atprofile'
import AtProfile from '@/models/atprofile'
import { useHead } from '@unhead/vue'

useHead({
    title: 'Edit',
})

const contentModified = computed(() => settings.content && settings.content !== userAtProfile.value.content)
const replaceTokensModified = computed(() => settings.replaceTokens !== userAtProfile.value.replaceTokens)
const newlinesToLinebreaksModified = computed(
    () => settings.newlinesToLinebreaks !== userAtProfile.value.newlinesToLinebreaks,
)
const modified = computed(
    () => contentModified.value || replaceTokensModified.value || newlinesToLinebreaksModified.value,
)

const content = computed({
    get: () => (contentModified.value ? settings.content : userAtProfile.value.content),
    set: (value) => {
        settings.content = value
    },
})
const replaceTokens = computed({
    get: () => (replaceTokensModified.value ? settings.replaceTokens : userAtProfile.value.replaceTokens),
    set: (value) => {
        settings.replaceTokens = value
    },
})
const newlinesToLinebreaks = computed({
    get: () =>
        newlinesToLinebreaksModified.value ? settings.newlinesToLinebreaks : userAtProfile.value.newlinesToLinebreaks,
    set: (value) => {
        settings.newlinesToLinebreaks = value
    },
})

const updatedAtProfile = computed(() =>
    AtProfile.parse({
        content: content.value,
        replaceTokens: replaceTokens.value,
        newlinesToLinebreaks: newlinesToLinebreaks.value,
        createdAt: userAtProfile.value.createdAt,
    }),
)

const reset = () => {
    settings.content = userAtProfile.value.content
    settings.replaceTokens = userAtProfile.value.replaceTokens
    settings.newlinesToLinebreaks = userAtProfile.value.newlinesToLinebreaks
}

const save = () => putAtProfile(updatedAtProfile.value)
</script>
<template>
    <main class="flex flex-col">
        <div class="flex-1 flex flex-col md:flex-row">
            <div class="flex flex-1 h-[50%] md:h-auto md:flex-none md:w-[50%] lg:w-[40%] relative order-1 md:order-0">
                <div class="absolute top-0 right-0 z-50 flex gap-2 p-2">
                    <button v-if="modified" @click="reset" class="btn btn-circle btn-error">
                        <TrashIcon class="fill-current w-6" />
                    </button>
                    <button v-if="modified" @click="save" class="btn btn-circle btn-success">
                        <ArrowDownTrayIcon class="fill-current w-6" />
                    </button>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-circle btn-neutral">
                            <Cog6ToothIcon class="fill-current w-6" />
                        </div>
                        <fieldset
                            tabindex="0"
                            class="dropdown-content fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64 shadow-md"
                        >
                            <legend class="fieldset-legend">Options</legend>
                            <label class="fieldset-label">
                                <input type="checkbox" v-model="replaceTokens" class="toggle" />
                                Replace tokens
                            </label>
                            <label class="fieldset-label">
                                <input type="checkbox" v-model="newlinesToLinebreaks" class="toggle" />
                                Newlines to linebreaks
                            </label>
                            <label for="code-theme-select" class="fieldset-label"> Code Editor Theme </label>
                            <select id="code-theme-select" v-model="settings.codeTheme" class="select">
                                <option value="">Default</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="hc">Scheme High Contrast</option>
                                <option value="light-hc">Light High Contrast</option>
                                <option value="dark-hc">Dark High Contrast</option>
                            </select>
                        </fieldset>
                    </div>
                </div>
                <CodeEditor class="w-full" language="html" v-model="content" />
            </div>
            <ProfileRenderer
                v-if="userProfile"
                class="flex-1 h-[50%] md:h-auto md:w-[50%] lg:w-[60%]"
                :profile="userProfile"
                :at-profile="updatedAtProfile"
            />
        </div>
    </main>
</template>
