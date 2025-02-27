<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a New Poll</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleCreateVote">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Poll Title</label>
            <input id="title" name="title" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Poll Title" v-model="title" />
          </div>
          <div class="mt-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows="3" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Description" v-model="description"></textarea>
          </div>
        </div>

        <div class="flex items-center">
          <input id="multipleChoice" name="multipleChoice" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" v-model="multipleChoice" />
          <label for="multipleChoice" class="ml-2 block text-sm text-gray-900">Allow multiple choices</label>
        </div>

        <div class="flex items-center">
          <input id="isPrivate" name="isPrivate" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" v-model="isPrivate" />
          <label for="isPrivate" class="ml-2 block text-sm text-gray-900">Make poll private</label>
        </div>

        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input id="startDate" name="startDate" type="datetime-local" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" v-model="startDate" />
        </div>

        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
          <input id="endDate" name="endDate" type="datetime-local" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" v-model="endDate" />
        </div>

        <div class="flex items-center">
          <input id="active" name="active" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" v-model="active" />
          <label for="active" class="ml-2 block text-sm text-gray-900">Activate poll immediately</label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Choices</label>
          <div v-for="(choice, index) in choices" :key="index" class="flex items-center space-x-2 mt-2">
            <input type="text" v-model="choice.text" placeholder="Choice" class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            <button type="button" @click="removeChoice(index)" class="px-2 py-1 text-sm text-red-600 hover:text-red-800">Remove</button>
          </div>
          <button type="button" @click="addChoice" class="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Choice
          </button>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Poll
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');
const description = ref('');
const multipleChoice = ref(false);
const isPrivate = ref(false);
const startDate = ref('');
const endDate = ref('');
const active = ref(true);
const choices = ref([{ text: '' }, { text: '' }]);

const addChoice = () => {
  choices.value.push({ text: '' });
};

const removeChoice = (index: number) => {
  choices.value.splice(index, 1);
};

const handleCreateVote = () => {
  // Here you would typically make an API call to create a new vote
  // For this example, we'll just simulate a successful creation
  const newPoll = {
    title: title.value,
    description: description.value,
    multipleChoice: multipleChoice.value,
    isPrivate: isPrivate.value,
    startDate: new Date(startDate.value).toISOString(),
    endDate: new Date(endDate.value).toISOString(),
    active: active.value,
    choices: choices.value.map(c => c.text).filter(Boolean)
  };

  console.log('New poll created:', newPoll);

  // In a real application, you would send this data to your backend
  // For example:
  // await api.createPoll(newPoll);

  // After successful creation, redirect to the home page or the new poll page
  router.push('/');
};
</script>

