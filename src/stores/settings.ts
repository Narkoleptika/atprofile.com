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
    newlinesToLinebreaks: savedSettings.newlinesToLinebreaks === true,
    context: Array.isArray(savedSettings.context)
        ? savedSettings.context.map((item) => ({
              collection: String(item.collection || ''),
              name: String(item.name || ''),
              rkey: String(item.rkey || ''),
              limit: Number(item.limit || 50),
          }))
        : null,
})

export const reset = () => {
    settings.content = ''
    settings.newlinesToLinebreaks = false
    settings.context = null
}

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
