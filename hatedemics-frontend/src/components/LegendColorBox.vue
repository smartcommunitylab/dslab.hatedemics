<style scoped>
.color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
<template>
    <div class="d-flex flex-column align-center">
      <div :style="{ backgroundColor: color }" class="color-box" />
      <span class="text-caption mt-1">{{ label }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ color: string; label: string }>();
  </script>
  

  