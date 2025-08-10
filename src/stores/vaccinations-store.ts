import { defineStore } from 'pinia';
import { type IVaccination } from 'src/types';

interface IVaccinationsState {
  vaccinationsMap: Record<number, IVaccination>;
}

export const useVaccinationsStore = defineStore('vaccinations', {
  state: (): IVaccinationsState => ({
    vaccinationsMap: {},
  }),
  getters: {
    vaccinationsList(state) {
      return Object.values(state.vaccinationsMap);
    },
    vaccinationsByCategory: (state) => {
      return Object.values(state.vaccinationsMap).reduce(
        (acc: Record<string, IVaccination[]>, curr) => {
          if (curr.category) {
            if (!acc[curr.category.value]) acc[curr.category.value] = [];
            acc[curr.category.value]?.push(curr);
          }
          return acc;
        },
        {},
      );
    },
    getCategoryCount: (state) => (category: string) => {
      return Object.values(state.vaccinationsMap).filter((v) => v.category?.value === category)
        .length;
    },
  },
  actions: {
    deleteVaccination(id: number) {
      delete this.vaccinationsMap[id];
    },
    updateVaccination(vaccination: IVaccination) {
      if (this.vaccinationsMap[vaccination.id]) {
        this.vaccinationsMap[vaccination.id] = { ...vaccination };
      }
    },
    addVaccination(vaccination: IVaccination) {
      const newId = Math.max(...Object.keys(this.vaccinationsMap).map(Number), 0) + 1;
      const newVaccination = {
        ...vaccination,
        id: newId,
      } as IVaccination;

      this.vaccinationsMap[newId] = newVaccination;
      return newVaccination;
    },
  },
});
