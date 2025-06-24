<template>
  <q-page>
    <q-form class="q-gutter-md q-pa-md">
      <c-file v-model="formData.avatar" class="q-mx-auto" />
      <q-input
        v-model="formData.name"
        label="Кличка"
        hide-bottom-space
        :rules="[(val) => !!val || 'Обязательное поле']"
      />
      <q-select
        v-model="formData.gender"
        :options="genderList"
        label="Пол"
        option-value="id"
        option-label="value"
        emit-value
        map-options
      />
      <q-select
        v-model="formData.type"
        :options="typeList"
        option-value="id"
        option-label="value"
        label="Вид"
        emit-value
        map-options
      />
      <q-input
        v-model="formData.birthDate"
        mask="##.##.####"
        label="Дата рождения"
        hide-bottom-space
        :rules="[
          (val) => !!val || 'Выберите дату',
          (val) => isValidPastDate(val) || 'Дата не может быть в будущем',
        ]"
      >
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formData.birthDate" minimal mask="DD.MM.YYYY">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="row no-wrap">
        <q-btn class="q-pa-md q-mr-md" label="Назад" to="pets-list" color="grey" />
        <q-btn label="Добавить" color="black" @click="addPet" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import CFile from 'components/custom-components/c-file.vue';
import { type TPet } from 'src/types/Pet';
import { usePetsStore } from 'src/stores/pets-store';
import { typeList, genderList } from 'src/utils';

const router = useRouter();
const petsStore = usePetsStore();

async function addPet() {
  petsStore.addPet(formData.value);
  await router.push('/pets-list');
}

const formData = ref({
  id: Date.now(),
  name: undefined,
  gender: 1,
  type: 1,
  birthDate: undefined,
  avatar: undefined,
}) as unknown as Ref<TPet>;

function isValidPastDate(dateString: string): boolean {
  const dateISOString = dateString.split('.').reverse().join('-');
  const today = new Date();
  const inputDate = new Date(dateISOString);
  return inputDate <= today;
}
</script>

<style lang="scss" scoped>
.q-btn {
  display: block;
  border-radius: 24px;
  width: 90%;
}
</style>
