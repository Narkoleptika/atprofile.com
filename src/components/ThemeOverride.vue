<script setup lang="ts">
import { computed } from 'vue'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid'
import { prefersDark } from '@/stores/theme'

const model = defineModel<boolean>({ default: false })
const overriddenTheme = computed(() => (prefersDark.value ? 'emerald' : 'abyss'))
</script>
<template>
    <label class="flex">
        <div class="flex-1">Toggle Theme</div>
        <div class="swap swap-rotate">
            <input type="checkbox" class="theme-controller" v-model="model" :value="overriddenTheme" />
            <SunIcon :class="prefersDark ? 'swap-off' : 'swap-on'" class="h-4 w-4 fill-current" />
            <MoonIcon :class="prefersDark ? 'swap-on' : 'swap-off'" class="h-4 w-4 fill-current" />
        </div>
    </label>
</template>
