<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4 text-gray-700">Cast Your Vote</h2>
    <div class="space-y-2">
      <button
          v-for="option in options"
          :key="option.id"
          @click="$emit('vote', option.id)"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ option.text }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

interface VotingOption {
  id: number;
  text: string;
  votes: number;
}

defineProps<{
  options: VotingOption[];
}>();

defineEmits<{
  (e: 'vote', id: number): void;
}>();
</script>

