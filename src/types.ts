export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

export interface Plant {
  uid: string;
  ownerId: string;
  name: string;
  species: string;
  location: string;
  healthStatus: 'Saludable' | 'Estable' | 'Necesita Atención';
  lastWatered: string;
  wateringFrequencyDays: number;
  imageUrl: string;
  createdAt: string;
}

export interface Task {
  uid: string;
  plantId: string;
  ownerId: string;
  type: 'Riego' | 'Rotación' | 'Fertilización';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}
