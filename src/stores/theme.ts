import { computed, ref } from 'vue'
import settings from '@/stores/settings'

const prefersDarkMQ = window.matchMedia('(prefers-color-scheme: dark)')

export const prefersDark = ref(prefersDarkMQ.matches)
export const isLight = computed(
    () => (!prefersDark.value && !settings.overrideTheme) || (prefersDark.value && settings.overrideTheme),
)
export const isDark = computed(
    () => (prefersDark.value && !settings.overrideTheme) || (!prefersDark.value && settings.overrideTheme),
)

prefersDarkMQ.addEventListener('change', (event) => {
    prefersDark.value = event.matches
})
