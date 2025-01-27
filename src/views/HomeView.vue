<script setup lang="ts">
import HandleSearch from '@/components/HandleSearch.vue'
import IconAtProfile from '@/components/IconAtProfile.vue'
</script>
<template>
    <main class="p-2">
        <div class="prose text-center m-auto">
            <IconAtProfile class="fill-(--tw-prose-headings) w-30 inline-block" />
            <h1 class="mb-2">AT Profile</h1>
            <h2 class="mt-0">Custom profiles built on top of AT Protocol</h2>
            <p>Search for a bluesky handle to see their AT Profile</p>
            <HandleSearch />
        </div>
    </main>
</template>
