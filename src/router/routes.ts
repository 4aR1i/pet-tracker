import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/pets-list',
    children: [
      { path: '/pets-list', component: () => import('pages/PetsListPage.vue') },
      { path: '/pets-add', component: () => import('pages/AddFormPage.vue') },
      {
        path: '/pet/:id',
        component: () => import('layouts/PetLayout.vue'),
        props: (route) => ({ petId: route.params.id }),
        children: [
          { path: 'overview', component: () => import('pages/OverviewPage.vue') },
          { path: 'vaccinations', component: () => import('pages/VaccinationsPage.vue') },
          // { path: 'weight', component: () => import('pages/pet/WeightPage.vue') },
          // { path: 'medications', component: () => import('pages/pet/MedicationsPage.vue') },
          { path: '', redirect: 'overview' },
        ],
      },
    ],
  },
];

export default routes;
