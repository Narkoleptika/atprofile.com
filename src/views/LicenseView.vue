<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
const licenses = ref([
    {
        name: 'package 1',
        version: '1.0.0',
        licenseText:
            'The MIT License (MIT)\n\nCopyright (c) 1-present, Human Person\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n',
    },
    {
        name: 'package 2',
        version: '0.0.1',
        licenseText:
            'The MIT License (MIT)\n\nCopyright (c) 1-present, Human Person\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n',
    },
])

onBeforeMount(async () => {
    if (import.meta.env.DEV) {
        return
    }

    licenses.value = []

    try {
        licenses.value = await (await fetch('/oss-licenses.json')).json()
    } catch (error) {
        console.error(error)
    }
})
</script>
<template>
    <main class="p-2">
        <div class="prose m-auto">
            <h1 class="text-center mb-0">Acknowledgements</h1>
            <ul class="list bg-base-200 rounded-box shadow-md mt-2 mb-2">
                <li v-for="{ name, version, licenseText } in licenses" :key="name" class="list-row">
                    <h2 class="text-center mt-0">{{ name }} {{ version }}</h2>
                    <div class="list-col-wrap whitespace-break-spaces">{{ licenseText }}</div>
                </li>
            </ul>
        </div>
    </main>
</template>
