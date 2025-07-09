<template>
  <q-page class="q-py-lg q-px-md">
    <div class="pet-overview-container">
      <q-btn
        v-if="!isEditing"
        class="absolute-top-right"
        icon="edit"
        color="primary"
        round
        flat
        @click="isEditing = true"
      >
        <q-tooltip>Редактировать</q-tooltip>
      </q-btn>
      <div class="row">
        <div class="col-12 col-md-4 flex flex-center">
          <c-file v-model="editedPet.avatar" :disabled="!isEditing" class="q-mx-auto" />
        </div>
        <div class="col-12 col-md-8">
          <q-form class="q-gutter-md" @submit.prevent="saveChanges">
            <q-input
              v-model="editedPet.name"
              label="Кличка"
              :disable="!isEditing"
              :rules="[(val) => !!val || 'Обязательное поле']"
              hide-bottom-space
            />
            <q-select
              v-model="editedPet.type"
              :options="typeList"
              option-value="id"
              option-label="title"
              label="Тип"
              :disable="!isEditing"
            />
            <q-select
              v-model="editedPet.gender"
              :options="genderList"
              option-value="id"
              option-label="title"
              label="Пол"
              :disable="!isEditing"
            />
            <q-input
              v-model="editedPet.birthDate"
              mask="##.##.####"
              label="Дата рождения"
              hide-bottom-space
              :rules="[
                (val) => !!val || 'Выберите дату',
                (val) => isValidPastDate(val) || 'Дата не может быть в будущем',
              ]"
              :disable="!isEditing"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="editedPet.birthDate" minimal mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input v-model="editedPet.breed" label="Порода" :disable="!isEditing" />
            <q-input
              v-model.number="editedPet.weight"
              type="number"
              label="Вес (кг)"
              :disable="!isEditing"
            />
            <div v-if="isEditing" class="q-pt-md flex flex-center">
              <q-btn label="Сохранить изменения" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CFile from 'components/custom-components/c-file.vue';
import { usePetsStore } from 'src/stores/pets-store';
import { type TPet } from 'src/types/Pet';
import { genderList, typeList, isValidPastDate } from 'src/utils';

const route = useRoute();
const router = useRouter();
const petsStore = usePetsStore();

const petId = computed(() => Number(route.params.id));
const originalPet = computed<TPet | undefined>(() => petsStore.petById(petId.value));

const editedPet = ref({
  id: 0,
  name: '',
  gender: undefined,
  type: undefined,
  birthDate: '',
  avatar: '',
  breed: '',
  weight: undefined,
}) as unknown as Ref<TPet>;

const isEditing = ref<boolean>(false);

onBeforeMount(async () => {
  if (originalPet.value) {
    editedPet.value = { ...originalPet.value };
  } else {
    const pet = petsStore.loadPetById(petId.value);

    if (pet) {
      editedPet.value = { ...pet };
    } else {
      await router.push('/pets-list');
    }
  }
});

function saveChanges() {
  petsStore.updatePet(editedPet.value);
  isEditing.value = false;
}
</script>

<style lang="scss" scoped>
.pet-overview-container {
  position: relative;
  max-width: 900px;
  margin: auto;
}
</style>
