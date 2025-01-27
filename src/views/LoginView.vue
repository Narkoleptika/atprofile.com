<script setup lang="ts">
import { login } from '@/stores/auth'
import { ref } from 'vue'

const handle = ref('')
</script>
<template>
    <main class="p-2">
        <div class="prose text-center m-auto">
            <h1>Login</h1>
            <form @submit.prevent="login(handle)">
                <fieldset class="fieldset w-xs m-auto bg-base-200 border border-base-300 p-4 rounded-box">
                    <label for="login-handle-input" class="fieldset-label">Handle</label>
                    <input
                        id="login-handle-input"
                        type="text"
                        class="input"
                        name="handle"
                        placeholder="your-handle.bsky.social"
                        v-model="handle"
                        required
                    />

                    <button class="btn btn-neutral mt-4">Login</button>
                </fieldset>
            </form>
        </div>
    </main>
</template>
