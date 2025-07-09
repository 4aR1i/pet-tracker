import { type TDictionaryField } from "src/types";

export type TPet = {
  id: number;
  name: string;
  gender: TDictionaryField;
  type: TDictionaryField;
  birthDate: string;
  avatar: string;
  breed?: string;
  weight?: number;
};
