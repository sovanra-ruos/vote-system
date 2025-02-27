<template>
  <div>
    <h2 class="text-xl font-semibold mb-4 text-gray-700">Voting Results</h2>
    <div class="space-y-4">
      <div v-for="result in results" :key="result.id" class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {{ result.text }}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-blue-600">
              {{ result.percentage.toFixed(2) }}%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
              :style="{ width: `${result.percentage}%` }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface VotingResult {
  id: number;
  text: string;
  votes: number;
  percentage: number;
}

defineProps<{
  results: VotingResult[];
}>();
</script>

