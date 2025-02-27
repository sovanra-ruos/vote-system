<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">

      <!-- Loading State -->
      <div v-if="loading" class="p-6 text-center">
        <p class="text-xl text-gray-600">Loading poll...</p>
      </div>

      <!-- Poll Content -->
      <div v-else-if="poll" class="p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ poll.title }}</h2>
        <p class="text-gray-600 mb-6">{{ poll.description }}</p>

        <!-- Voting Section -->
        <div v-if="!userVoted" class="mb-6">
          <div class="space-y-4">
            <div v-for="(choice, index) in poll.choices" :key="index" class="flex items-center space-x-3">
              <button
                  @click="selectChoice(index)"
                  class="flex-grow py-2 px-4 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :class="{ 'bg-indigo-100 border-indigo-500': selectedVote === index }"
              >
                {{ choice.text }}
              </button>
            </div>
          </div>

          <!-- Submit Vote Button -->
          <div class="mt-6 text-center">
            <button
                @click="submitVote"
                :disabled="selectedVote === null || submitting"
                class="px-6 py-2 rounded-md text-white font-medium"
                :class="{
                'bg-indigo-600 hover:bg-indigo-700': selectedVote !== null && !submitting,
                'bg-gray-300 cursor-not-allowed': selectedVote === null || submitting
              }"
            >
              {{ submitting ? "Submitting..." : "Submit Vote" }}
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900">Results</h3>
          <div class="space-y-4 mt-4">
            <div v-for="(choice, index) in poll.choices" :key="index" class="relative">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-900">{{ choice.text }}</span>
                <span class="text-sm font-medium text-gray-900">{{ calculatePercentage(index) }}%</span>
              </div>
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full bg-indigo-500 transition-all duration-500"
                    :style="{ width: calculatePercentage(index) + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            Total votes: {{ totalVotes }}
          </div>
        </div>
      </div>

      <!-- Poll Not Found -->
      <div v-else class="p-6 text-center">
        <p class="text-xl text-gray-600">Poll not found.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface Choice {
  text: string;
  votes: number;
}

interface Poll {
  uuid: string;
  title: string;
  description: string;
  choices: Choice[];
}

const route = useRoute();
const poll = ref<Poll | null>(null);
const loading = ref(true);
const submitting = ref(false);
const selectedVote = ref<number | null>(null);
const userVoted = ref(false);
const totalVotes = ref(0);

const calculatePercentage = (index: number) => {
  if (!poll.value || totalVotes.value === 0) return 0;
  return Math.round((poll.value.choices[index].votes / totalVotes.value) * 100);
};

const selectChoice = (index: number) => {
  selectedVote.value = index;
};

const submitVote = async () => {
  if (!poll.value || selectedVote.value === null) return;

  submitting.value = true;
  try {
    const requestBody = {
      pollUuid: poll.value.uuid, // Use poll.uuid from API
      selectedChoiceName: poll.value.choices[selectedVote.value].text, // Choice text
    };

    const response = await fetch(`https://vote-system-api.psa-khmer.world/api/v1/vote/create-vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to submit vote');
    }

    userVoted.value = true;
    localStorage.setItem(`voted-${poll.value.uuid}`, "true");

    // Refresh results
    await fetchResults();
  } catch (error) {
    console.error("Error submitting vote:", error);
  } finally {
    submitting.value = false;
  }
};

const fetchPoll = async () => {
  try {
    const pollId = route.params.id as string;
    const response = await fetch(`https://vote-system-api.psa-khmer.world/api/v1/poll/${pollId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch poll');
    }

    const data = await response.json();

    poll.value = {
      ...data,
      choices: data.choices.map((choice: string) => ({
        text: choice,
        votes: 0,
      })),
    };

    await fetchResults();
  } catch (error) {
    console.error("Error fetching poll details:", error);
  } finally {
    loading.value = false;
  }
};

const fetchTotalVotes = async () => {
  if (!poll.value) return;

  try {
    const response = await fetch(`https://vote-system-api.psa-khmer.world/api/v1/vote/count/${poll.value.uuid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch total vote count');
    }

    totalVotes.value = await response.json();
  } catch (error) {
    console.error("Error fetching total votes:", error);
    totalVotes.value = 0;
  }
};

const fetchResults = async () => {
  if (!poll.value) return;

  const pollId = route.params.id as string;

  try {
    const votePromises = poll.value.choices.map(async (choice) => {
      const encodedChoiceText = encodeURIComponent(choice.text);
      const response = await fetch(`https://vote-system-api.psa-khmer.world/api/v1/vote/count/${pollId}/${encodedChoiceText}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch vote count for choice: ${choice.text}`);
        return { choice, votes: 0 };
      }

      const voteCount = await response.json();
      return { choice, votes: Number(voteCount) };
    });

    const results = await Promise.all(votePromises);
    results.forEach(({ choice, votes }) => {
      choice.votes = votes;
    });

    await fetchTotalVotes();
  } catch (error) {
    console.error("Error fetching poll results:", error);
  }
};

onMounted(async () => {
  await fetchPoll();
  if (localStorage.getItem(`voted-${route.params.id}`)) {
    userVoted.value = true;
  }
});
</script>
