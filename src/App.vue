<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isLoggedIn, logout } from '@/stores/auth'
import settings from '@/stores/settings'
import ThemeOverride from '@/components/ThemeOverride.vue'
import { userProfile } from '@/stores/bsky'
import HandleSearch from '@/components/HandleSearch.vue'
import IconBsky from '@/components/IconBsky.vue'
import { UserIcon } from '@heroicons/vue/24/solid'
import IconAtProfile from '@/components/IconAtProfile.vue'
import IconGithub from '@/components/IconGithub.vue'
</script>

<template>
    <nav class="navbar bg-base-300 text-base-content gap-2">
        <div class="md:flex-1">
            <RouterLink to="/" class="text-xl inline-flex items-center">
                <IconAtProfile class="fill-current w-6 inline-block" />
                <span>Profile</span>
            </RouterLink>
        </div>
        <HandleSearch class="flex-1 md:flex-none w-auto" />
        <div class="dropdown dropdown-end">
            <div
                tabindex="0"
                role="button"
                class="btn btn-ghost btn-circle avatar"
                :class="{ 'avatar-placeholder': !isLoggedIn }"
            >
                <div class="bg-neutral text-neutral-content w-10 rounded-full">
                    <img v-if="isLoggedIn" alt="Tailwind CSS Navbar component" :src="userProfile?.avatar" />
                    <UserIcon v-else class="fill-current w-6" />
                </div>
            </div>
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow-md"
            >
                <li v-if="isLoggedIn">
                    <RouterLink
                        active-class="menu-active"
                        :to="{ name: 'profile', params: { handle: userProfile?.handle } }"
                    >
                        Profile
                    </RouterLink>
                    <RouterLink active-class="menu-active" :to="{ name: 'edit' }"> Edit Profile </RouterLink>
                </li>
                <li v-if="!isLoggedIn"><RouterLink to="/login">Login</RouterLink></li>
                <li><ThemeOverride v-model="settings.overrideTheme" /></li>
                <li v-if="isLoggedIn"><RouterLink to="/" @click="logout">Logout</RouterLink></li>
            </ul>
        </div>
    </nav>
    <RouterView class="flex-1" />
    <footer class="footer bg-neutral text-neutral-content place-items-center p-2">
        <nav class="grid-flow-col gap-4">
            <a target="_blank" href="https://github.com/Narkoleptika/atprofile.com">
                <IconGithub class="fill-current w-6" />
            </a>
            <a target="_blank" href="https://bsky.app/profile/atprofile.com">
                <IconBsky class="fill-current w-6" />
            </a>
        </nav>
    </footer>
</template>
<style src="@/assets/css/global.css"></style>
