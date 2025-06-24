import { defineStore, acceptHMRUpdate } from 'pinia';
import { type TPet } from 'src/types/Pet';

export const usePetsStore = defineStore('pets', {
  state: (): {
    pets: TPet[];
  } => ({
    pets: JSON.parse(localStorage.getItem('pets') || '[]'),
  }),

  getters: {},

  actions: {
    addPet(data: TPet) {
      this.pets.push(data);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('pets', JSON.stringify(this.pets));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePetsStore, import.meta.hot));
}
