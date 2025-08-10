export interface IVaccination {
  id: number;
  category: IVaccinationCategory | null;
  title: string;
  dosage: string;
  date: string;
  status: string;
}

export interface IVaccinationCategory {
  label: string;
  value: string;
}