<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden p-5 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
    <!-- Poll Title -->
    <h3 class="text-xl font-bold text-gray-900 mb-1">{{ poll.title }}</h3>

    <!-- Poll Description -->
    <p class="text-gray-600 text-sm">{{ poll.description }}</p>
  </div>
</template>

<script lang="ts" setup>
interface Poll {
  id: string;
  title: string;
  description: string;
}

defineProps<{ poll: Poll }>();
</script>
