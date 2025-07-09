<template>
  <q-list class="q-gutter-md q-pa-md">
    <pet-mini-card v-for="pet in pets" :key="pet.id" :pet="pet" />
  </q-list>

  <q-btn
    to="pets-add"
    color="primary"
    label="Добавить питомца"
    icon-right="add"
    class="q-pa-md q-mt-lg q-mx-auto"
  />
</template>

<script lang="ts" setup>
import PetMiniCard from 'src/components/PetMiniCard.vue';
import { usePetsStore } from 'src/stores/pets-store';
import { computed, onMounted } from 'vue';

const petsStore = usePetsStore();

const pets = computed(() => petsStore.petsList);

onMounted(() => petsStore.loadPets());
</script>

<style lang="scss" scoped>
.page-header {
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.q-btn {
  display: block;
  border-radius: 24px;
  width: 90%;
}
</style>
