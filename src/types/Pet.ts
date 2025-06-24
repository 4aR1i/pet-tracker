export type TPet = {
  id: number;
  name: string;
  gender: number;
  type: number;
  birthDate: string;
  avatar: File;
  ownerId?: number;
  breed?: string;
  createdAt?: Date;
};
