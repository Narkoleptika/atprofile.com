<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
import ProfileRenderer from '@/components/ProfileRenderer.vue'
import { userProfile } from '@/stores/bsky'
import settings from '@/stores/settings'
import { computed, ref } from 'vue'
import defaultProfile from '@/assets/text/default-profile.txt?raw'
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'

const shouldReplaceTokens = ref(true)
const newlinesToLinebreaks = ref(false)
const editorContent = computed({
    get: () => settings.editorContent || defaultProfile,
    set: (value) => {
        if (value === defaultProfile) {
            settings.editorContent = ''

            return
        }
        settings.editorContent = value
    },
})
</script>
<template>
    <main class="flex flex-col">
        <div class="flex-1 flex flex-col md:flex-row">
            <div class="flex flex-1 h-[50%] md:h-auto md:flex-none md:w-[50%] lg:w-[40%] relative order-1 md:order-0">
                <div class="absolute top-0 right-0 z-50 flex gap-2 p-2">
                    <button
                        v-if="settings.editorContent"
                        @click="settings.editorContent = ''"
                        class="btn btn-circle btn-error"
                    >
                        <TrashIcon class="fill-current w-6" />
                    </button>
                    <button
                        v-if="settings.editorContent"
                        @click="settings.editorContent = ''"
                        class="btn btn-circle btn-success"
                    >
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
                                <input type="checkbox" v-model="shouldReplaceTokens" class="toggle" />
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
                <CodeEditor class="w-full" language="html" v-model="editorContent" />
            </div>
            <ProfileRenderer
                v-if="userProfile"
                class="flex-1 h-[50%] md:h-auto md:w-[50%] lg:w-[60%]"
                :content="editorContent"
                :handle="userProfile.handle"
                :should-replace-tokens="shouldReplaceTokens"
                :newlines-to-linebreaks="newlinesToLinebreaks"
            />
        </div>
    </main>
</template>
