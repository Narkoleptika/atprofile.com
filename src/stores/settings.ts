import { computed, reactive, watch } from 'vue'

let savedSettings: Record<string, unknown> = {}

try {
    savedSettings = JSON.parse(localStorage.getItem('settings') || '{}')
} catch (error) {
    console.error(error)
}

export const settings = reactive({
    overrideTheme: savedSettings.overrideTheme === true,
    codeTheme: String(savedSettings.codeTheme || ''),
    content: String(savedSettings.content || ''),
    replaceTokens: savedSettings.replaceTokens !== false,
    newlinesToLinebreaks: savedSettings.newlinesToLinebreaks === true,
})

export default settings

const settingsJson = computed(() => {
    try {
        return JSON.stringify(settings)
    } catch {
        return ''
    }
})

watch(settings, () => {
    try {
        localStorage.setItem('settings', settingsJson.value)
    } catch (error) {
        console.error(error)
    }
})
