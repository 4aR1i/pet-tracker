<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat icon="menu" @click="$router.push('/pets-list')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-grey">
      <q-tabs
        active-color="primary"
        indicator-color="transparent"
        no-caps
        dense
      >
        <q-route-tab icon="dashboard" label="Инфо" :to="`/pet/${petId}/overview`" />
        <q-route-tab icon="local_hospital" label="Прививки" :to="`/pet/${petId}/vaccinations`" />
        <!-- <q-route-tab icon="monitor_weight" label="Вес" :to="`/pet/${petId}/weight`" />
        <q-route-tab icon="medical_services" label="Лекарства" :to="`/pet/${petId}/medications`" /> -->
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const petId = route.params.id
</script>