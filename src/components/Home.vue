<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-12">Active Polls</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p class="mt-4 text-xl text-gray-600">Loading polls...</p>
      </div>

      <!-- No Polls Available -->
      <div v-else-if="polls.length === 0" class="text-center">
        <p class="text-xl text-gray-600">No active polls at the moment.</p>
      </div>

      <!-- Polls List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
            v-for="poll in polls"
            :key="poll.id"
            :to="{ name: 'PollDetail', params: { id: poll.id } }"
            class="block"
        >
          <PollCard
              :poll="poll"
              @vote="handleVote"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import PollCard from './PollCard.vue';

interface Choice {
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
}

const polls = ref<Poll[]>([]);
const loading = ref(true);

const fetchPolls = async () => {
  try {
    const response = await fetch('https://vote-system-api.psa-khmer.world/api/v1/poll?page=0&size=10');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("Fetched Polls:", data);

    // Transform API response into expected format
    polls.value = data.results.map((poll: any) => ({
      id: poll.uuid,
      title: poll.title,
      description: poll.description,
      choices: poll.choices.map((choice: string) => ({ text: choice, votes: 0 }))
    }));
  } catch (error) {
    console.error("Error fetching polls:", error);
  } finally {
    loading.value = false;
  }
};

const handleVote = (pollId: string, choiceIndex: number) => {
  const poll = polls.value.find(p => p.id === pollId);
  if (poll) {
    poll.choices[choiceIndex].votes++;
  }
};

onMounted(fetchPolls);
</script>