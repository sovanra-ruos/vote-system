<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Edit Poll
                  </h3>
                  <div class="mt-4 space-y-6">
                    <!-- Poll Title -->
                    <div>
                      <label for="edit-title" class="block text-sm font-medium text-gray-700">Poll Title</label>
                      <input
                          type="text"
                          id="edit-title"
                          v-model="editedPoll.title"
                          required
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter poll title"
                      />
                    </div>

                    <!-- Poll Description -->
                    <div>
                      <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                          id="edit-description"
                          v-model="editedPoll.description"
                          rows="3"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Describe your poll"
                      ></textarea>
                    </div>

                    <!-- Multiple Choice and Private Poll Checkboxes -->
                    <div class="flex space-x-4">
                      <div class="flex items-center">
                        <input
                            id="edit-multipleChoice"
                            type="checkbox"
                            v-model="editedPoll.multipleChoice"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label for="edit-multipleChoice" class="ml-2 block text-sm text-gray-700">
                          Multiple Choice
                        </label>
                      </div>
                      <div class="flex items-center">
                        <input
                            id="edit-isPrivate"
                            type="checkbox"
                            v-model="editedPoll.isPrivate"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label for="edit-isPrivate" class="ml-2 block text-sm text-gray-700">
                          Private Poll
                        </label>
                      </div>
                    </div>

                    <!-- Start and End Date -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="edit-startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="edit-startDate"
                            v-model="editedPoll.startDate"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="edit-endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="edit-endDate"
                            v-model="editedPoll.endDate"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <!-- Poll Choices -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Choices</label>
                      <TransitionGroup name="list" tag="ul" class="space-y-2">
                        <li v-for="(choice, index) in editedPoll.choices" :key="choice.id" class="flex items-center space-x-2">
                          <input
                              type="text"
                              v-model="choice.text"
                              :placeholder="`Choice ${index + 1}`"
                              class="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                          />
                          <button
                              type="button"
                              @click="removeEditChoice(index)"
                              class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              :disabled="editedPoll.choices.length <= 2"
                          >
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      </TransitionGroup>
                      <button
                          type="button"
                          @click="addEditChoice"
                          class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Choice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  @click="saveChanges"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="isSubmitting"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                  type="button"
                  @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
              Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';

interface Choice {
  id: number;
  text: string;
}

interface PollFormData {
  uuid: string;
  title: string;
  description: string;
  multipleChoice: boolean;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  choices: Choice[];
}

const props = defineProps<{
  isOpen: boolean;
  poll: any;
  nextChoiceId: number;
}>();

const emit = defineEmits(['close', 'save']);

const isSubmitting = ref(false);
const editedPoll = reactive<PollFormData>({
  uuid: '',
  title: '',
  description: '',
  multipleChoice: false,
  isPrivate: false,
  startDate: '',
  endDate: '',
  active: true,
  choices: [],
});

let localNextChoiceId = ref(1);

watch(() => props.nextChoiceId, (newVal) => {
  localNextChoiceId.value = newVal;
});

watch(() => props.poll, (newPoll) => {
  if (newPoll) {
    editedPoll.uuid = newPoll.uuid;
    editedPoll.title = newPoll.title;
    editedPoll.description = newPoll.description;
    editedPoll.multipleChoice = newPoll.multipleChoice;
    editedPoll.isPrivate = newPoll.isPrivate;
    editedPoll.startDate = formatDateForInput(new Date(newPoll.startDate));
    editedPoll.endDate = formatDateForInput(new Date(newPoll.endDate));
    editedPoll.active = newPoll.active;

    // Convert string choices to Choice objects
    editedPoll.choices = Array.isArray(newPoll.choices)
        ? newPoll.choices.map((choice: string) => ({
          id: localNextChoiceId.value++,
          text: choice
        }))
        : [];
  }
}, { immediate: true });

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const addEditChoice = () => {
  editedPoll.choices.push({ id: localNextChoiceId.value++, text: '' });
};

const removeEditChoice = (index: number) => {
  if (editedPoll.choices.length > 2) {
    editedPoll.choices.splice(index, 1);
  }
};

const closeModal = () => {
  emit('close');
};

const saveChanges = async () => {
  try {
    isSubmitting.value = true;

    // Prepare data for API
    const apiData = {
      title: editedPoll.title,
      description: editedPoll.description,
      multipleChoice: editedPoll.multipleChoice,
      isPrivate: editedPoll.isPrivate,
      startDate: new Date(editedPoll.startDate).toISOString(),
      endDate: new Date(editedPoll.endDate).toISOString(),
      active: editedPoll.active,
      choices: editedPoll.choices.map(choice => choice.text)
    };

    const response = await fetch(`http://localhost:8080/api/v1/poll/poll/${editedPoll.uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update poll: ${response.statusText}`);
    }

    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log('Poll updated successfully:', responseData);

    // Emit save event with updated poll data
    emit('save', {
      ...editedPoll,
      choices: editedPoll.choices.map(choice => choice.text)
    });

    closeModal();
  } catch (error) {
    console.error('Error updating poll:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

