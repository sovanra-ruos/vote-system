<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Create Poll Form -->
      <h2 class="text-3xl font-extrabold text-center text-gray-900 mb-8">Create a New Poll</h2>
      <form @submit.prevent="handleSubmit" class="space-y-8 bg-white shadow-md rounded-lg p-8 mb-8">
        <div class="space-y-6">
          <!-- Poll Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Poll Title</label>
            <input
                type="text"
                id="title"
                v-model="newPoll.title"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter poll title"
            />
          </div>

          <!-- Poll Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
                id="description"
                v-model="newPoll.description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your poll"
            ></textarea>
          </div>

          <!-- Multiple Choice and Private Poll Checkboxes -->
          <div class="flex space-x-4">
            <div class="flex items-center">
              <input
                  id="multipleChoice"
                  type="checkbox"
                  v-model="newPoll.multipleChoice"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="multipleChoice" class="ml-2 block text-sm text-gray-700">
                Multiple Choice
              </label>
            </div>
            <div class="flex items-center">
              <input
                  id="isPrivate"
                  type="checkbox"
                  v-model="newPoll.isPrivate"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="isPrivate" class="ml-2 block text-sm text-gray-700">
                Private Poll
              </label>
            </div>
          </div>

          <!-- Start and End Date -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                  type="date"
                  id="startDate"
                  v-model="newPoll.startDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
              <input
                  type="date"
                  id="endDate"
                  v-model="newPoll.endDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Poll Choices -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Choices</label>
            <TransitionGroup name="list" tag="ul" class="space-y-2">
              <li v-for="(choice, index) in newPoll.choices" :key="choice.id" class="flex items-center space-x-2">
                <input
                    type="text"
                    v-model="choice.text"
                    :placeholder="`Choice ${index + 1}`"
                    class="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
                <button
                    type="button"
                    @click="removeChoice(index)"
                    class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    :disabled="newPoll.choices.length <= 2"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </li>
            </TransitionGroup>
            <button
                type="button"
                @click="addChoice"
                class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Choice
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Poll' }}
          </button>
        </div>
      </form>

      <!-- API Message -->
      <div v-if="apiMessage" :class="apiError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'" class="p-4 rounded-md mb-6">
        {{ apiMessage }}
      </div>

      <!-- Display Created Polls -->
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Created Polls</h3>
      <TransitionGroup name="list" tag="ul" class="space-y-4">
        <li v-for="poll in polls" :key="poll.uuid" class="bg-white shadow-md rounded-lg p-6 transition-all duration-300 ease-in-out">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ poll.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ poll.description }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                  @click="openEditModal(poll)"
                  class="inline-flex items-center p-1 border border-transparent rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                  @click="deletePoll(poll.uuid)"
                  class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                  @click="togglePollStatus(poll)"
                  :class="poll.active ? 'text-green-600 hover:bg-green-100' : 'text-gray-600 hover:bg-gray-100'"
                  class="inline-flex items-center p-1 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-2">
            <h5 class="text-sm font-medium text-gray-700">Choices:</h5>
            <ul class="list-disc list-inside">
              <li v-for="choice in poll.choices" :key="choice" class="text-sm text-gray-600">
                {{ choice }}
              </li>
            </ul>
          </div>
          <div class="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>Status: {{ poll.active ? 'Active' : 'Inactive' }}</div>
            <div>Type: {{ poll.multipleChoice ? 'Multiple Choice' : 'Single Choice' }}</div>
            <div>Visibility: {{ poll.isPrivate ? 'Private' : 'Public' }}</div>
            <div>Start: {{ formatDate(poll.startDate) }}</div>
            <div>End: {{ formatDate(poll.endDate) }}</div>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <!-- Edit Poll Modal -->
    <UpdatePollModal
        :is-open="isEditModalOpen"
        :poll="currentEditPoll"
        :next-choice-id="nextChoiceId"
        @close="closeEditModal"
        @save="handleEditSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import UpdatePollModal from "./UpdatePollModal.vue";


interface Choice {
  id: number;
  text: string;
}

interface PollFormData {
  title: string;
  description: string;
  multipleChoice: boolean;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  choices: Choice[];
}

interface ApiPollData {
  title: string;
  description: string;
  multipleChoice: boolean;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  choices: string[];
}

interface Poll {
  uuid: string;
  title: string;
  description: string;
  multipleChoice: boolean;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  choices: string[];
}

const API_URL = 'https://vote-system-api.psa-khmer.world/api/v1/poll/create-poll';
const POLLS_URL = 'https://vote-system-api.psa-khmer.world/api/v1/poll?page=0&size=10';
const polls = ref<Poll[]>([]);
const isSubmitting = ref(false);
const apiMessage = ref('');
const apiError = ref(false);

let nextPollId = 1;
let nextChoiceId = ref(1);

// Set default dates to now and now + 7 days
const now = new Date();
const oneWeekLater = new Date(now);
oneWeekLater.setDate(oneWeekLater.getDate() + 7);

const formatDateForInput = (date: Date): string => {
  return date.toISOString().slice(0, 16);
};

const newPoll = reactive<PollFormData>({
  title: '',
  description: '',
  multipleChoice: false,
  isPrivate: false,
  startDate: formatDateForInput(now),
  endDate: formatDateForInput(oneWeekLater),
  active: true,
  choices: [
    { id: nextChoiceId.value++, text: '' },
    { id: nextChoiceId.value++, text: '' },
  ],
});

const addChoice = () => {
  newPoll.choices.push({ id: nextChoiceId.value++, text: '' });
};

const removeChoice = (index: number) => {
  if (newPoll.choices.length > 2) {
    newPoll.choices.splice(index, 1);
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchPolls = async () => {
  try {
    const response = await fetch(POLLS_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch polls');
    }
    const data = await response.json();
    polls.value = data.results;
  } catch (error) {
    console.error('Error fetching polls:', error);
  }
};

onMounted(() => {
  fetchPolls();
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    apiMessage.value = '';
    apiError.value = false;

    // Transform choice objects to strings for API
    const apiData: ApiPollData = {
      title: newPoll.title,
      description: newPoll.description,
      multipleChoice: newPoll.multipleChoice,
      isPrivate: newPoll.isPrivate,
      startDate: new Date(newPoll.startDate).toISOString(),
      endDate: new Date(newPoll.endDate).toISOString(),
      active: newPoll.active,
      choices: newPoll.choices.map(choice => choice.text)
    };

    // Send to API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)
    });

    // Check for success and handle response text properly
    if (response.ok) {
      // Try to parse as JSON first
      let responseText;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          responseText = data.message || 'Poll created successfully!';
        } catch (error) {
          responseText = await response.text();
        }
      } else {
        responseText = await response.text();
      }

      // Add to local state with generated ID
      const poll: Poll = {
        uuid: `generated-${nextPollId++}`,
        ...newPoll,
        choices: newPoll.choices.map(choice => choice.text),
      };

      polls.value.push(poll);
      apiMessage.value = responseText || 'Poll created successfully!';

      // Reset form
      newPoll.title = '';
newPoll.description = '';
newPoll.multipleChoice = false;
newPoll.isPrivate = false;
newPoll.startDate = formatDateForInput(new Date());
newPoll.endDate = formatDateForInput(oneWeekLater);
newPoll.choices = [
  { id: nextChoiceId.value++, text: '' },
  { id: nextChoiceId.value++, text: '' },
];
    } else {
      // Handle error response
      let errorMessage;
      try {
        // Try to parse as JSON first
        const errorData = await response.json();
        errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        // If not JSON, get as text
        errorMessage = await response.text();
      }
      throw new Error(errorMessage || `Request failed with status ${response.status}`);
    }

  } catch (error) {
    console.error('Error creating poll:', error);
    apiMessage.value = error instanceof Error ? error.message : 'An error occurred while creating the poll';
    apiError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const deletePoll = async (uuid: string) => {
  try {
    const response = await fetch(`https://vote-system-api.psa-khmer.world/api/v1/poll/delete/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete poll: ${response.statusText}`);
    }

    // Remove the poll from the local state
    const index = polls.value.findIndex(poll => poll.uuid === uuid);
    if (index !== -1) {
      polls.value.splice(index, 1);
    }

    console.log('Poll deleted successfully');
  } catch (error) {
    console.error('Error deleting poll:', error);
  }
};

const isEditModalOpen = ref(false);
const currentEditPoll = ref<Poll | null>(null);

const openEditModal = (poll: Poll) => {
  currentEditPoll.value = poll;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  currentEditPoll.value = null;
};

const handleEditSave = (updatedPoll: Poll) => {
  // Find and update the poll in the local state
  const index = polls.value.findIndex(p => p.uuid === updatedPoll.uuid);
  if (index !== -1) {
    polls.value[index] = {
      ...updatedPoll,
      // Ensure the poll object has the correct structure
      startDate: updatedPoll.startDate,
      endDate: updatedPoll.endDate
    };
  }

  // Refresh the polls list to show the updated data
  fetchPolls();
};

const togglePollStatus = (poll: Poll) => {
  poll.active = !poll.active;
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

