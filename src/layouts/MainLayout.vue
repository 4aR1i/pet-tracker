<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="main-layout">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.q-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #ffffff);
}
.main-layout {
  padding-top: env(safe-area-inset-top);
}
</style>
