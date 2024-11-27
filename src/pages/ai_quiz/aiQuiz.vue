<template>
  <Transition name="slide-fade">
    <q-banner v-if="!showThirdCard" class="q-mb-md q-pa-md shadow-2" style="border-radius: 6px">
      <div class="flex justify-between">
        <div class="column">
          <p class="text-subtitle1 q-mb-none">Build your own challenge</p>
          <p class="text-caption q-mb-none">Create a custom challenge for your team</p>
        </div>
        <q-btn flat color="black" :to="{ name: 'saved-challenges' }">
          <q-icon name="visibility" />
          <span class="q-ml-sm">View saved challenges</span>
        </q-btn>
      </div>
    </q-banner>
  </Transition>

  <Transition name="slide-fade">
    <section v-if="!showThirdCard" class="row wrap-sm">
      <!-- Form -->
      <div class="col-md-5 col-sm-12">
        <Form @showChallenge="showFirstCard = false" />
      </div>

      <!-- First card // Challenge details -->
      <div class="col-md-7 col-sm-12">
        <Transition name="slide-fade">
          <ChallengeDetails v-if="!showFirstCard" />
          <!-- <ChallengeDetails /> -->
        </Transition>

        <!-- Empty state -->
        <div v-if="showFirstCard && !showThirdCard" class="q-pl-sm flex-row">
          <q-card>
            <q-card-section>
              <div>
                <div class="text-center">
                  <q-img src="/icons/aiquiz_empty.svg" width="100px" />
                  <p class="text-subtitle1">Generated Challenge will be placed here</p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>
  </Transition>

  <!-- Third card // Saved Challenges -->
  <Transition name="slide-fade">
    <SavedChallenges v-if="showThirdCard" class="col-sm-12 col-md-12" />
  </Transition>
</template>

<script setup>
import Form from 'components/aiQuiz/Form.vue'
import ChallengeDetails from 'components/aiQuiz/ChallengeDetails.vue'
import SavedChallenges from 'src/components/aiQuiz/SavedChallenges.vue'
import { ref } from 'vue'

const showFirstCard = ref(true)
const showThirdCard = ref(false)
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-leave-active {
  transition: all 0s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
