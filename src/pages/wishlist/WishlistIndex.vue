<template>
  <div class="row" style="gap: 1rem">
    <div class="col-2">
      <div class="text-subtitle q-mb-md">My Lists</div>
      <q-list class="full-width">
        <q-item
          v-for="(item, index) in wishlistStore.categoryList"
          :key="index"
          clickable
          @click="wishlistStore.updateSelectedCategory(item)"
          class="full-width rounded-borders"
          :active="wishlistStore.selectedCategory.sk === item.sk"
          :activeClass="'bg-grey-2 dark-list'"
        >
          <q-item-section class="full-width">{{ item?.name }}</q-item-section>
        </q-item>
      </q-list>
      <BaseBtn
        flat
        dense
        class="bg-transparent q-mt-md q-py-md q-px-sm"
        :class="$q.dark.mode ? 'text-white' : 'text-black'"
        icon="create_new_folder"
        @click="addListModal = true"
        label="Create a list"
      />
    </div>
    <div class="row q-col-gutter-md col-grow col-9">
      <template v-if="wishlistStore.categorizedWishlists?.length">
        <div
          v-for="(course, index) in wishlistStore.categorizedWishlists"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          :class="{ disabled: course.disabled }"
          :key="index"
        >
          <SlideView :data="course" :key="course.id" @moveToCourseInfo="moveToCourseInfo" />
        </div>
      </template>
      <div
        v-if="!wishlistStore.isLoading && !wishlistStore.categorizedWishlists?.length"
        class="take-rest-height full-width flex column justify-center items-center"
      >
        <q-icon name="app:no-wishlist" size="lg" />
        <p class="text-weight-bold q-mt-md">You don’t have any courses in your favourite.</p>
        <BaseBtn @click="redirectToCourseDashboard" unelevated class="text-weight-regular" label="View course" color="primary" />
      </div>
    </div>
  </div>

  <BaseInnerLoading :showing="wishlistStore.isLoading" label="Loading Wishlists" />

  <BaseDialog title="Create New List" v-model="addListModal" @close="handleCloseModal">
    <q-form class="q-pa-md" @submit.prevent.stop="handleAddNewList">
      <BaseInput
        placeholder="List title "
        v-model="listTitle"
        :rules="[(val) => !!val || 'Please enter list title', ...minLength(2), ...maxLength(15)]"
      />
      <BaseBtn type="submit" label="Add" class="float-right q-mb-md" />
    </q-form>
  </BaseDialog>
</template>

<script setup>
import { useCourseWishlist } from 'src/store/pinia/course/wishlist'
import SlideView from 'components/dashboard/SlideView.vue'
import { useRouter } from 'vue-router'

import { useQuasar } from 'quasar'
import { loader } from 'src/utils/helpers'
import { ref } from 'vue'
import { maxLength, minLength, required } from 'src/utils/rules'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'

const router = useRouter()

const wishlistStore = useCourseWishlist()
const coursesStore = useCoursesStore()
const macroMetaStore = useMacroMetaStore()
const $q = useQuasar()

const addListModal = ref(false)
const listTitle = ref('')

const redirectToCourseDashboard = () => {
  router.push({ name: 'courses' })
}

const moveToCourseInfo = async (event) => {
  $q.loading.show(loader({}))
  try {
    const data = event.info
    const payload = { event_id: data.sk }

    if (data.is_enrolled) {
      await redirectionToCoursePage(payload, false)
    } else if (!data.is_enrolled) {
      await coursesStore.enrollUserCourse(payload)
      wishlistStore.updateEnrollStatus(data.sk)
      if (coursesStore.statusOfEnroll) {
        await redirectionToCoursePage(payload, true)
      }
    }
  } catch (error) {
    //
  } finally {
    $q.loading.hide()
  }
}

const redirectionToCoursePage = async (payload, enroll = false) => {
  await coursesStore.fetchCourse(payload)
  if (enroll) {
    await addAnalytics(payload.event_id, coursesStore.courseInfo.learningPaths)
  }
  if (
    coursesStore.courseHeaderData.id === payload.event_id &&
    coursesStore.courseHeaderData.is_enrolled &&
    coursesStore.courseHeaderData.is_active
  ) {
    let statusBreak = false
    let index = 0
    for (const item of coursesStore.courseOutlineData) {
      if (statusBreak) {
        break
      }
      let subItemsIndex = 0
      if (item.items ? item.items.length > 0 : false) {
        for (const subItems of item.items) {
          if (subItems.url) {
            if (!subItems.isCompleted || (coursesStore.courseOutlineData.length === index + 1 && subItemsIndex + 1 === item.items.length)) {
              statusBreak = true
              await router.push(subItems.url)
              break
            }
          }
          subItemsIndex++
        }
      }
      index++
    }
  }
}

const addAnalytics = async (eventId, learningPaths) => {
  await macroMetaStore.publishCourseStats({
    course: eventId,
    learning_path: learningPaths
  })
}

const handleCloseModal = () => {
  addListModal.value = false
  listTitle.value = ''
}

async function handleAddNewList() {
  wishlistStore.addNewCategory(listTitle.value)
  handleCloseModal()
}
</script>

<style lang="scss" scoped>
.take-rest-height {
  height: calc(100vh - 260px);
}
.dark-list {
  &.q-item--dark {
    background-color: $blue-6 !important;
    color: $white !important;
  }
}
</style>
