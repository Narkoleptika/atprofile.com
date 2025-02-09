<script setup lang="ts">
import HandleSearch from '@/components/HandleSearch.vue'
import IconAtProfile from '@/components/IconAtProfile.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import { isLoggedIn } from '@/stores/auth'
import { RouterLink } from 'vue-router'
</script>
<template>
    <main class="p-2">
        <div class="prose text-center m-auto">
            <div role="alert" class="alert alert-warning mb-2">
                <ExclamationTriangleIcon class="h-6 w-6 shrink-0 fill-current" />
                <span>
                    AT Profile is in beta and things are likely to change and break. Features may change without
                    warning. If you make any cool stuff, please keep in mind that it may get lost or need to be migrated
                    later.
                </span>
            </div>
            <IconAtProfile class="fill-(--tw-prose-headings) w-30 inline-block" />
            <h1 class="mb-2">AT Profile</h1>
            <h2 class="mt-0">Custom profiles built on top of AT Protocol</h2>
            <p>Search for a bluesky handle to see their AT Profile</p>
            <HandleSearch />
            <p v-if="isLoggedIn">Or <RouterLink to="/edit">edit</RouterLink> your own profile!</p>
            <p v-else>Or <RouterLink to="/login">login</RouterLink> to edit your own profile!</p>
        </div>
    </main>
</template>
