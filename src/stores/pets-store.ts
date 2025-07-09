import { defineStore, acceptHMRUpdate } from 'pinia';
import { type TPet } from 'src/types/Pet';

export const usePetsStore = defineStore('pets', {
  state: (): {
    petsMap: Record<number, TPet>;
  } => ({
    petsMap: {},
  }),

  getters: {
    petsList: (state) => {
      return Object.values(state.petsMap);
    },
    petById: (state) => {
      return (petId: number) => state.petsMap[petId];
    },
  },

  actions: {
    addPet(pet: TPet) {
      this.petsMap[pet.id] = pet;
      this.saveToLocalStorage();
    },
    updatePet(updatedPet: TPet) {
      if (this.petsMap[updatedPet.id]) {
        this.petsMap[updatedPet.id] = updatedPet;
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('pets', JSON.stringify(this.petsList));
    },
    loadPets() {
      const petsFromLS: TPet[] = JSON.parse(localStorage.getItem('pets') || '[]');
      this.petsMap = petsFromLS.reduce(
        (acc, curr) => ((acc[curr.id] = curr), acc),
        {} as typeof this.petsMap,
      );
    },
    loadPetById(petId: number): TPet | null {
      if (this.petsMap[petId]) {
        return this.petsMap[petId];
      }

      const petsFromLS: TPet[] = JSON.parse(localStorage.getItem('pets') || '[]');
      const petFromLS = petsFromLS.find((pet) => pet.id === petId);

      if (petFromLS) {
        this.petsMap[petId] = petFromLS;
        return petFromLS;
      }

      return null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePetsStore, import.meta.hot));
}
