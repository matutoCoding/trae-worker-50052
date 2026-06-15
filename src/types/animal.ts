export type AnimalStatus = 'healthy' | 'treating' | 'critical' | 'recovered' | 'quarantine' | 'adoptable' | 'released' | 'adopted';

export type AnimalSource = 'rescue' | 'donation' | 'transfer' | 'other';

export type HealthLevel = 'A' | 'B' | 'C' | 'D';

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: 'male' | 'female' | 'unknown';
  weight: number;
  status: AnimalStatus;
  source: AnimalSource;
  sourceDetail: string;
  receiveDate: string;
  healthLevel: HealthLevel;
  description: string;
  avatar: string;
  cageNumber: string;
  isQuarantine: boolean;
  quarantineEndDate?: string;
  injuryDescription: string;
  treatmentPlan: string;
  feedingSchedule: string;
  trainingPlan?: string;
  releaseDate?: string;
  releaseLocation?: string;
  adoptable: boolean;
  createTime: string;
  updateTime: string;
}

export interface TreatmentRecord {
  id: string;
  animalId: string;
  date: string;
  type: 'check' | 'medication' | 'surgery' | 'vaccination' | 'other';
  title: string;
  description: string;
  medicines: MedicineItem[];
  veterinarian: string;
  notes?: string;
  nextFollowUp?: string;
}

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface FeedingRecord {
  id: string;
  animalId: string;
  date: string;
  time: string;
  foodType: string;
  quantity: string;
  feeder: string;
  appetite: 'good' | 'normal' | 'poor';
  notes?: string;
}

export interface CageCleanRecord {
  id: string;
  cageNumber: string;
  animalId?: string;
  date: string;
  cleaner: string;
  disinfection: boolean;
  notes?: string;
}

export interface RehabilitationRecord {
  id: string;
  animalId: string;
  date: string;
  trainingType: string;
  duration: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
  trainer: string;
  notes?: string;
}

export interface ReleaseRecord {
  id: string;
  animalId: string;
  releaseDate: string;
  releaseLocation: string;
  coordinates: string;
  environment: string;
  weather: string;
  recorder: string;
  notes?: string;
  trackRecords: TrackRecord[];
}

export interface TrackRecord {
  id: string;
  date: string;
  location: string;
  coordinates: string;
  healthStatus: string;
  behavior: string;
  recorder: string;
  notes?: string;
}

export interface AdoptionApplication {
  id: string;
  animalId: string;
  applicantName: string;
  applicantPhone: string;
  applicantAddress: string;
  experience: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  applyDate: string;
  reviewDate?: string;
  reviewer?: string;
  reviewNotes?: string;
}

export interface StatisticsData {
  totalAnimals: number;
  treatingCount: number;
  healthyCount: number;
  adoptableCount: number;
  releasedCount: number;
  adoptedCount: number;
  monthlyRescue: number[];
  speciesDistribution: { name: string; value: number }[];
}

export interface TodoItem {
  id: string;
  type: 'feeding' | 'treatment' | 'clean' | 'check';
  title: string;
  time: string;
  animalName?: string;
  status: 'pending' | 'completed';
}
