import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/pets-list',
    children: [
      { path: '/pets-list', component: () => import('pages/PetsListPage.vue') },
      { path: '/pets-add', component: () => import('pages/PetAddFormPage.vue') },
    ],
  },
];

export default routes;
