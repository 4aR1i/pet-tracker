<template>
  <q-item v-ripple.center clickable class="bg-white q-pa-lg">
    <q-item-section avatar>
      <q-avatar>
        <!-- <img :src="petAvatar" /> -->
        {{ petAvatar }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ pet.name }}</q-item-label>
      <q-item-label caption>{{ pet.type }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="chevron_right" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { type TPet } from 'src/types/Pet';
import { computed } from 'vue';

type Props = {
  pet: TPet;
};

const props = defineProps<Props>();
const petAvatar = computed(() => (props.pet.avatar ? props.pet.avatar : 'default'));
</script>

<style lang="scss" scoped>
.q-item {
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
