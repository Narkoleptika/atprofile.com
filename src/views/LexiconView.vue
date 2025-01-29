<script setup lang="ts">
import profileLexicon from '@/lexicon/definitions/com.atprofile.beta.profile.json?raw'
import { useHead } from '@unhead/vue'
useHead({
    title: 'Lexicon',
})
</script>
<template>
    <main class="p-2">
        <div class="prose m-auto">
            <h1 class="text-center">Lexicon</h1>
        </div>
        <div class="mockup-code container my-2 mx-auto">
            <pre data-prefix="1"><code class=" opacity-50">// com.atprofile.beta.profile.json</code></pre>
            <pre
                :data-prefix="i + 2"
                v-for="(line, i) in profileLexicon.split('\n')"
                :key="line + i"
            ><code>{{ line }}</code></pre>
        </div>
    </main>
</template>
