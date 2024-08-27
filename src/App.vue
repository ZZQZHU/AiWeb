<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedComponents">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
  <LoginModal />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LoginModal from "./components/login.vue";

const route = useRoute();

const cachedComponents = ref<string[]>(['home', 'ai', 'aibot', 'finance', 'developer', 'chat', 'dify']);

watch(route, (newRoute) => {
  // 动态添加或移除缓存的组件
  if (newRoute.name === 'blog' || newRoute.name === 'blog2' || newRoute.name === 'tem' || newRoute.name === 'publish' || newRoute.name === 'notification' || newRoute.name === 'vip') {
    const index = cachedComponents.value.indexOf(newRoute.name as string);
    if (index !== -1) {
      cachedComponents.value.splice(index, 1);
    }
  } else {
    if (!cachedComponents.value.includes(newRoute.name as string)) {
      cachedComponents.value.push(newRoute.name as string);
    }
  }
});
</script>

<style scoped></style>
