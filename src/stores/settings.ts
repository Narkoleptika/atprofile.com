import AtProfile, { defaultAtProfile } from '@/models/atprofile'
import { computed, reactive, watch } from 'vue'

let savedSettings: Record<string, unknown> = {}

try {
    savedSettings = JSON.parse(localStorage.getItem('settings') || '{}')
} catch (error) {
    console.error(error)
}

const settingsAtProfile = AtProfile.parse({
    content: savedSettings.content || defaultAtProfile.content,
    replaceTokens: savedSettings.replaceTokens,
    newlinesToLinebreaks: savedSettings.newlinesToLinebreaks,
    context: savedSettings.context || defaultAtProfile.context,
})

export const settings = reactive({
    overrideTheme: savedSettings.overrideTheme === true,
    codeTheme: String(savedSettings.codeTheme || ''),
    content: settingsAtProfile.content,
    replaceTokens: settingsAtProfile.replaceTokens,
    newlinesToLinebreaks: settingsAtProfile.newlinesToLinebreaks,
    context: settingsAtProfile.context,
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
