
  
  <style scoped>
  .circle {
    border-radius: 50%;
    background-color: #ccc;
  }
  </style>
  <template>
    <div class="d-flex flex-column align-center">
      <div :style="{ width: diameter + 'px', height: diameter + 'px' }" class="circle" />
      <span class="text-caption mt-1">{{ label }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ diameter: number; label: string }>();
  </script>
  