<template>
  <div id="app">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import Navbar from './components/Navbar.vue';

const isAuthenticated = ref(false);
const currentUser = ref(null);

provide('isAuthenticated', isAuthenticated);
provide('currentUser', currentUser);

const login = (user: any) => {
  isAuthenticated.value = true;
  currentUser.value = user;
};

const logout = () => {
  isAuthenticated.value = false;
  currentUser.value = null;
};

provide('login', login);
provide('logout', logout);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>