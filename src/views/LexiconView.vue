<script setup lang="ts">
import profileLexicon from '@/lexicon/definitions/com.atprofile.beta.profile.json'
</script>
<template>
    <main class="p-2">
        <div class="prose m-auto">
            <h1 class="text-center">Lexicon</h1>
        </div>
        <div class="container mx-auto">
            <code>com.atprofile.beta.profile.json</code>
            <pre class="mt-0 bg-neutral text-neutral-content"><code>{{ profileLexicon }}</code></pre>
        </div>
    </main>
</template>
