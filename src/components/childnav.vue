<!-- ChildNavbar.vue -->
<template>
    <div>
      <h2>Sub Navbar</h2>
      <ul v-if="selectedCategory">
        <li v-for="subCategory in selectedCategory.subCategories" :key="subCategory.id">
          {{ subCategory.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  const { selectedCategory } = defineProps(['selectedCategory']);
  </script>
  