<template>
  <q-layout view="lHh Lpr lFf">
    <div class="page-wrapper">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.q-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #ffffff);
}
</style>
