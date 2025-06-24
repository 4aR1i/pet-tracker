export type TPet = {
  id: number;
  name: string;
  gender: number;
  type: number;
  birthDate: string;
  avatar: string;
  ownerId?: number;
  breed?: string;
  createdAt?: Date;
};
