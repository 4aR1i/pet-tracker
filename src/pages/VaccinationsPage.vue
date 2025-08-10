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
      :default-opened="true"
    >
      <q-card>
        <q-card-section class="q-pa-0">
          <q-list bordered separator>
            <q-item
              v-for="vaccination in vaccinationsByCategory[category.key]"
              :key="vaccination.id"
            >
              <q-item-section>
                <q-item-label>{{ vaccination.title }}</q-item-label>
                <q-item-label caption>Дата: {{ formatDate(vaccination.date) }}</q-item-label>
                <q-item-label caption>Статус: {{ vaccination.status }}</q-item-label>
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

          <div v-if="getCategoryCount(category.key) === 0" class="text-center q-my-md q-pa-md">
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
              hide-bottom-space
              :rules="[(val) => !!val || 'Выберите категорию']"
              class="q-mb-sm"
            />
            <q-input v-model="form.title" label="Препарат" filled class="q-mb-sm" />
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
import { computed, ref } from 'vue';
import { useVaccinationsStore } from 'src/stores/vaccinations-store';
import { type INotificationEvent, type IVaccination } from 'src/types';
import { useLocalNotifications } from 'src/composables';

const vaccinationsStore = useVaccinationsStore();
const { scheduleMultipleNotifications, cancelEventNotification } = useLocalNotifications();

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

const form = ref<IVaccination>({
  id: 0,
  category: null,
  title: '',
  dosage: '',
  date: '',
  status: 'Предстоит',
});

const vaccinations = computed(() => vaccinationsStore.vaccinationsList);
const vaccinationsByCategory = computed(() => vaccinationsStore.vaccinationsByCategory);
const getCategoryCount = computed(() => (category: string) => {
  return vaccinationsStore.getCategoryCount(category);
});

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return dateString;
};

const openAddDialog = () => {
  form.value = {
    id: 0,
    category: null,
    title: '',
    dosage: '',
    date: '',
    status: 'Предстоит',
  };
  showDialog.value = true;
};

const deleteVaccination = async (id: number) => {
  vaccinationsStore.deleteVaccination(id);
  await cancelEventNotification(id);
};

const editVaccination = (vaccination: IVaccination) => {
  isEditMode.value = true;
  form.value = { ...vaccination };
  showDialog.value = true;
};

const submitForm = async () => {
  if (isEditMode.value) {
    const oldVaccination = vaccinations.value.find((v) => v.id === form.value.id);
    if (oldVaccination) {
      await cancelEventNotification(oldVaccination.id);
    }
    vaccinationsStore.updateVaccination({ ...form.value });

    const event: INotificationEvent = {
      id: form.value.id,
      title: 'Напоминание о прививке',
      body: `Завтра запланирована прививка: ${form.value.title}`,
      date: form.value.date,
      extra: { type: 'vaccination', vaccine: form.value.title },
    };

    await scheduleMultipleNotifications(event);
  } else {
    const newVaccination = vaccinationsStore.addVaccination({ ...form.value});

    const event: INotificationEvent = {
      id: newVaccination.id,
      title: 'Напоминание о прививке',
      body: `Завтра запланирована прививка: ${newVaccination.title}`,
      date: newVaccination.date,
      extra: { type: 'vaccination', vaccine: newVaccination.title },
    };

    await scheduleMultipleNotifications(event, {defaultTime: ''});
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
