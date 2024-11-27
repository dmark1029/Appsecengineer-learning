<template>
  <div class="row justify-end full-width">
    <BaseBtn
      style="font-size: 0.7rem"
      flat
      dense
      :disabled="isLoading"
      outline
      aria-label="Favorite controller"
      :style="{
        padding: '5px 8px !important'
      }"
    >
      <div v-if="!isLoading">
        <q-img
          v-if="isInWishlist"
          src="/newIcons/wishlist_outlined.png"
          width="21px"
          @click.stop="handleAddClick"
          @dblclick.stop="handleAddToRootClick"
        >
          <q-tooltip>Mark as favourite</q-tooltip>
        </q-img>
        <q-img v-else src="/newIcons/wishlist_filled.png" width="21px" @click.stop="removeWishlist">
          <q-tooltip>Remove from favorite</q-tooltip>
        </q-img>
      </div>
      <q-spinner-ios color="primary" v-else size="xs" />

      <q-menu v-model="openCategoriesList">
        <q-list>
          <q-item>
            <q-item-section>
              <q-form
                ref="addForm"
                class="q-pt-sm flex items-start justify-between q-gutter-lg full-width no-wrap"
                @submit.prevent.stop="handleAddNewList"
              >
                <BaseInput
                  placeholder="List title "
                  v-model="listTitle"
                  class="q-ml-none"
                  :rules="[(val) => !!val || 'Please enter list title', ...minLength(2), ...maxLength(15)]"
                />
                <BaseBtn type="submit" unelevated round color="primary" icon="create_new_folder" size="md" />
              </q-form>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-for="(item, index) in wishlistStore.categoryList" :key="index" @click="addWishlist(item?.sk)" clickable v-close-popup>
            <q-item-section>{{ item?.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </BaseBtn>
  </div>
</template>

<script setup>
import { useCourseWishlist } from 'src/store/pinia/course/wishlist'
import { maxLength, minLength } from 'src/utils/rules'
import { shallowRef, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const wishlistStore = useCourseWishlist()

const route = useRoute()

const isLoading = shallowRef(false)
const openCategoriesList = shallowRef(false)
const listTitle = shallowRef('')
const addForm = ref(null)

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => {}
  },
  showWishlist: {
    type: Boolean,
    default: true
  }
})

async function handleAddClick() {
  listTitle.value = ''
  openCategoriesList.value = true
}

function handleAddToRootClick() {
  openCategoriesList.value = false
  addWishlist(wishlistStore.selectedCategory.name)
}
async function addWishlist(categorySk) {
  isLoading.value = true
  await wishlistStore.addWishlist(
    {
      event_id: props.event.id,
      events: props.event
    },
    categorySk
  )
  isLoading.value = false
}

async function removeWishlist() {
  isLoading.value = true
  await wishlistStore.removeWishlist({
    event_id: props.event.sk
  })
  isLoading.value = false
}

const isInWishlist = computed(() => {
  return !wishlistStore.isItemInWishlist(props.event) && route.name !== 'favorite'
})
function handleAddNewList() {
  wishlistStore.addNewCategory(listTitle.value)
  listTitle.value = ''
  addForm.value?.reset()
}
</script>

<style lang="scss"></style>
