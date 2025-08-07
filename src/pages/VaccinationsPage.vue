<template>
  <div class="q-pa-md">
    <q-btn
      class="block q-mb-md q-ml-auto"
      color="primary"
      icon="add"
      label="Добавить прививку"
      @click="openAddDialog"
    />

    <q-expansion-item
      v-for="category in vaccinationCategories"
      :key="category.key"
      :label="category.label"
      :caption="getCategoryCount(category.key) + ' записей'"
      icon="vaccines"
      class="q-mb-sm"
      :default-opened="!!getVaccinationsByCategory(category.key).length"
    >
      <q-card>
        <q-card-section class="q-pa-0">
          <q-list bordered separator>
            <q-item
              v-for="vaccination in getVaccinationsByCategory(category.key)"
              :key="vaccination.id"
            >
              <q-item-section>
                <q-item-label>{{ vaccination.vaccine }}</q-item-label>
                <q-item-label caption>Дата: {{ formatDate(vaccination.date) }}</q-item-label>
                <q-item-label caption>Статус: {{ vaccination.status }}</q-item-label>
                <q-item-label v-if="vaccination.vaccine" caption>
                  Препарат: {{ vaccination.vaccine }}
                </q-item-label>
                <q-item-label v-if="vaccination.dosage" caption>
                  Дозировка: {{ vaccination.dosage }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round dense icon="edit" @click="editVaccination(vaccination)" />
                <q-btn flat round dense icon="delete" @click="deleteVaccination(vaccination.id)" />
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-if="getVaccinationsByCategory(category.key).length === 0"
            class="text-center q-my-md q-pa-md"
          >
            <q-icon name="info_outline" size="48px" color="grey" />
            <div class="text-grey">Нет записей по этой категории</div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ isEditMode ? 'Редактировать прививку' : 'Добавить прививку' }}
          </div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitForm">
            <q-select
              v-model="form.category"
              :options="categoryOptions"
              label="Категория прививки"
              filled
              :rules="[(val) => !!val || 'Выберите категорию']"
              class="q-mb-sm"
            />

            <q-input v-model="form.vaccine" label="Препарат" filled class="q-mb-sm" />

            <q-input v-model="form.dosage" label="Дозировка" filled class="q-mb-sm" />

            <q-input
              v-model="form.date"
              mask="##.##.####"
              label="Дата прививки"
              hide-bottom-space
              filled
              :rules="[(val) => !!val || 'Выберите дату']"
              class="q-mb-sm"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.date" minimal mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="Статус"
              filled
              class="q-mb-md"
            />

            <div class="q-mt-md">
              <q-btn label="Сохранить" type="submit" color="primary" class="q-mr-sm" />
              <q-btn v-close-popup label="Отмена" flat color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Vaccination {
  id: number;
  category: string;
  vaccine: string;
  dosage: string;
  date: string;
  status: string;
}

const vaccinations = ref<Vaccination[]>([
  {
    id: 1,
    category: 'parasites',
    vaccine: 'Дронтал',
    dosage: '1 таблетка',
    date: '15.05.2023',
    status: 'Вовремя',
  },
  {
    id: 2,
    category: 'parasites',
    vaccine: 'Нексгард',
    dosage: '1 таблетка',
    date: '20.07.2023',
    status: 'Вовремя',
  },
  {
    id: 3,
    category: 'vaccines',
    vaccine: 'Рабизин',
    dosage: '1 мл',
    date: '10.03.2023',
    status: 'Вовремя',
  },
  {
    id: 4,
    category: 'vaccines',
    vaccine: 'Мультифел-4',
    dosage: '1 мл',
    date: '15.03.2023',
    status: 'Просрочена',
  },
]);

const showDialog = ref(false);
const isEditMode = ref(false);

const vaccinationCategories = [
  { key: 'vaccines', label: 'Вакцинация' },
  { key: 'parasites', label: 'Против паразитов' },
  { key: 'anthelmintic', label: 'Антигельминтные' },
  { key: 'other', label: 'Другие процедуры' },
];

const categoryOptions = vaccinationCategories.map((cat) => ({
  label: cat.label,
  value: cat.key,
}));

const statusOptions = ['Вовремя', 'Просрочена', 'Предстоит', 'Завершена'];

const form = ref<Vaccination>({
  id: 0,
  category: '',
  vaccine: '',
  dosage: '',
  date: '',
  status: 'Предстоит',
});

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return dateString;
};

const getVaccinationsByCategory = (category: string) => {
  return vaccinations.value.filter((v) => v.category === category);
};

const getCategoryCount = (category: string) => {
  return getVaccinationsByCategory(category).length;
};

const openAddDialog = () => {
  isEditMode.value = false;
  form.value = {
    id: 0,
    category: '',
    vaccine: '',
    dosage: '',
    date: '',
    status: 'Предстоит',
  };
  showDialog.value = true;
};

const editVaccination = (vaccination: Vaccination) => {
  isEditMode.value = true;
  form.value = { ...vaccination };
  showDialog.value = true;
};

const deleteVaccination = (id: number) => {
  vaccinations.value = vaccinations.value.filter((v) => v.id !== id);
};

const submitForm = () => {
  if (isEditMode.value) {
    const index = vaccinations.value.findIndex((v) => v.id === form.value.id);
    if (index !== -1) {
      vaccinations.value[index] = { ...form.value };
    }
  } else {
    const newId = Math.max(...vaccinations.value.map((v) => v.id), 0) + 1;
    vaccinations.value.push({
      ...form.value,
      id: newId,
    });
  }
  showDialog.value = false;
};
</script>

<style scoped>
.q-expansion-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
