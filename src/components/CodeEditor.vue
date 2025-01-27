<template>
    <div
        ref="$editor"
        class="transition-colors min-h-[250px]"
        :class="{
            'bg-neutral-100': !isCodeDark && !isHighContrast,
            'bg-neutral-900': isCodeDark && !isHighContrast,
            'bg-neutral-50': !isCodeDark && isHighContrast,
            'bg-neutral-950': isCodeDark && isHighContrast,
        }"
    />
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { settings } from '@/stores/settings'
import { isDark } from '@/stores/theme'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new JsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new CssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new HtmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new TsWorker()
        }

        return new EditorWorker()
    },
}

const model = defineModel<string>()
const props = withDefaults(
    defineProps<{
        language?: string
    }>(),
    {
        language: '',
    },
)

const $editor = ref(null)
let editor: monaco.editor.IStandaloneCodeEditor

const codeTheme = computed(() => {
    if (settings.codeTheme && settings.codeTheme !== 'hc') {
        return settings.codeTheme
    }

    const hcModifier = settings.codeTheme ? '-hc' : ''

    return isDark.value ? `dark${hcModifier}` : `light${hcModifier}`
})
const isCodeDark = computed(() => /dark/.test(codeTheme.value))
const isHighContrast = computed(() => /\-hc/.test(codeTheme.value))

const themes: [string, monaco.editor.BuiltinTheme][] = [
    ['light', 'vs'],
    ['dark', 'vs-dark'],
    ['light-hc', 'hc-light'],
    ['dark-hc', 'hc-black'],
]

themes.forEach(([theme, base]) => {
    monaco.editor.defineTheme(theme, {
        base,
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#00000000',
        },
    })
})

watch(model, () => {
    if (model.value !== editor.getValue()) {
        editor.setValue(model.value || '')
    }
})

watch(codeTheme, () => {
    monaco.editor.setTheme(codeTheme.value)
})

watch(
    () => props.language,
    () => {
        const editorModel = editor.getModel()

        if (!editorModel) {
            return
        }
        monaco.editor.setModelLanguage(editorModel, props.language)
    },
)

onMounted(() => {
    if (!$editor.value) {
        return
    }

    editor = monaco.editor.create($editor.value, {
        value: model.value,
        tabSize: 2,
        scrollBeyondLastLine: false,
        language: props.language,
        theme: codeTheme.value,
        automaticLayout: true,
        minimap: {
            enabled: false,
        },
    })

    editor.getModel()?.onDidChangeContent(() => {
        model.value = editor.getValue()
    })
})

onUnmounted(() => {
    editor.dispose()
})
</script>
<style>
.monaco-editor {
    position: absolute;
}
</style>
