<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
import ProfileRenderer from '@/components/ProfileRenderer.vue'
import { userProfile } from '@/stores/bsky'
import settings from '@/stores/settings'
import { computed, ref, watch } from 'vue'
import { TrashIcon, ArrowDownTrayIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { userAtProfile, putAtProfile } from '@/stores/atprofile'
import AtProfile, { defaultAtProfile } from '@/models/atprofile'
import { useHead } from '@unhead/vue'

useHead({
    title: 'Edit',
})

const atProfileFields = ['content', 'newlinesToLinebreaks', 'context'] as const
const contextItemFields = ['collection', 'name', 'limit', 'rkey'] as const

type AtProfileField = (typeof atProfileFields)[number]

const modified = computed(() => ({
    content: Boolean(settings.content) && settings.content !== userAtProfile.value.content,
    newlinesToLinebreaks: settings.newlinesToLinebreaks !== userAtProfile.value.newlinesToLinebreaks,
    context: (() => {
        if (!settings.context) {
            return false
        }

        if (settings.context?.length !== userAtProfile.value.context.length) {
            return true
        }

        for (let i = 0; i < settings.context.length; i++) {
            const a = settings.context[i]
            const b = userAtProfile.value.context[i]

            const contextItemFieldsModified = contextItemFields.filter((field) => a[field] !== b[field]).length

            if (contextItemFieldsModified) {
                return true
            }
        }

        return false
    })(),
    get any() {
        return atProfileFields.filter((field) => this[field]).length > 0
    },
}))

const makeGetter = <Type extends AtProfileField>(field: Type) =>
    modified.value[field] ? settings[field] : userAtProfile.value[field]
const makeComputedField = <Type extends AtProfileField>(field: Type) =>
    computed({
        get: () => makeGetter(field),
        set: (value: (typeof settings)[Type]) => {
            settings[field] = value
        },
    })

const content = makeComputedField('content')
const newlinesToLinebreaks = makeComputedField('newlinesToLinebreaks')
const context = ref((makeGetter('context') || []).map((item) => ({ id: crypto.randomUUID(), ...item })))

watch(
    context,
    (value) => {
        settings.context = value
    },
    { deep: true },
)

const updatedAtProfile = computed(() => {
    try {
        return AtProfile.parse({
            content: content.value,
            newlinesToLinebreaks: newlinesToLinebreaks.value,
            // eslint-disable-next-line no-undefined
            context: context.value.map((item) => ({ ...item, id: undefined })),
            createdAt: userAtProfile.value.createdAt,
        })
    } catch (error) {
        console.log(error)
    }

    return defaultAtProfile
})

const reset = () => {
    settings.content = userAtProfile.value.content
    settings.newlinesToLinebreaks = userAtProfile.value.newlinesToLinebreaks
    settings.context = userAtProfile.value.context
    context.value = userAtProfile.value.context.map((item) => ({ id: crypto.randomUUID(), ...item }))
}

const save = () => updatedAtProfile.value && putAtProfile(updatedAtProfile.value)

const addContext = () => {
    context.value = [
        ...context.value,
        {
            id: crypto.randomUUID(),
            collection: '',
            name: '',
            limit: 50,
            rkey: '',
        },
    ]
}

const removeContext = (id: string) => {
    context.value = context.value.filter((item) => item.id !== id)
}
</script>
<template>
    <main class="flex flex-col">
        <div class="flex-1 flex flex-col md:flex-row">
            <div class="flex flex-1 h-[50%] md:h-auto md:flex-none md:w-[50%] lg:w-[40%] relative order-1 md:order-0">
                <div class="absolute top-0 right-0 z-50 flex gap-2 p-2">
                    <button v-if="modified.any" @click="reset" class="btn btn-circle btn-error">
                        <TrashIcon class="fill-current w-6" />
                    </button>
                    <button v-if="modified.any" @click="save" class="btn btn-circle btn-success">
                        <ArrowDownTrayIcon class="fill-current w-6" />
                    </button>

                    <button
                        class="btn btn-circle btn-neutral"
                        popovertarget="popover-1"
                        style="anchor-name: --anchor-1"
                    >
                        <Cog6ToothIcon class="fill-current w-6" />
                    </button>
                    <fieldset
                        tabindex="0"
                        class="dropdown fieldset p-4 max-h-[75%] w-102 bg-base-100 border border-base-300 rounded-box shadow-md"
                        popover
                        id="popover-1"
                        style="position-anchor: --anchor-1"
                    >
                        <legend class="fieldset-legend">Options</legend>
                        <label for="code-theme-select" class="fieldset-label"> Code Editor Theme </label>
                        <select id="code-theme-select" v-model="settings.codeTheme" class="select w-full">
                            <option value="">Default</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="hc">Scheme High Contrast</option>
                            <option value="light-hc">Light High Contrast</option>
                            <option value="dark-hc">Dark High Contrast</option>
                        </select>
                        <label class="fieldset-label">
                            <input type="checkbox" v-model="newlinesToLinebreaks" class="toggle" />
                            Newlines to linebreaks
                        </label>
                        <template v-for="contextItem in context" :key="contextItem.id">
                            <label for="fetch-data-collection-input" class="fieldset-label">Collection</label>
                            <div class="flex">
                                <input
                                    id="fetch-data-collection-input"
                                    type="text"
                                    class="input w-full"
                                    name="collection"
                                    placeholder="xyz.statusphere.status"
                                    v-model="contextItem.collection"
                                    required
                                />
                                <button @click="removeContext(contextItem.id)" class="btn btn-circle ml-2">
                                    <TrashIcon class="w-4 fill-current" />
                                </button>
                            </div>
                            <div class="join">
                                <div class="join-item">
                                    <label for="fetch-data-name-input" class="fieldset-label">Name</label>
                                    <input
                                        id="fetch-data-name-input"
                                        type="text"
                                        class="input"
                                        name="name"
                                        placeholder="status"
                                        v-model="contextItem.name"
                                        required
                                    />
                                </div>
                                <div class="join-item">
                                    <label for="fetch-data-rkey-input" class="fieldset-label">rkey</label>
                                    <input
                                        id="fetch-data-rkey-input"
                                        type="text"
                                        class="input"
                                        name="rkey"
                                        v-model="contextItem.rkey"
                                    />
                                </div>
                                <div class="join-item min-w-20" v-if="!contextItem.rkey">
                                    <label for="fetch-data-limit-input" class="fieldset-label">Limit</label>
                                    <input
                                        id="fetch-data-limit-input"
                                        type="number"
                                        min="1"
                                        max="100"
                                        class="input"
                                        name="limit"
                                        v-model="contextItem.limit"
                                    />
                                </div>
                            </div>
                        </template>
                        <button class="btn w-102" @click="addContext">
                            <PlusIcon class="w-8 fill-current" />
                        </button>
                    </fieldset>
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
