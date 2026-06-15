import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Animal,
  TreatmentRecord,
  FeedingRecord,
  CageCleanRecord,
  RehabilitationRecord,
  ReleaseRecord,
  AdoptionApplication,
  StatisticsData,
  TodoItem
} from '../types/animal';
import {
  mockAnimals,
  mockTreatmentRecords,
  mockFeedingRecords,
  mockCageCleanRecords,
  mockRehabilitationRecords,
  mockReleaseRecords,
  mockAdoptionApplications,
  mockStatistics,
  mockTodos
} from '../data/mockData';

interface AnimalContextType {
  animals: Animal[];
  treatmentRecords: TreatmentRecord[];
  feedingRecords: FeedingRecord[];
  cageCleanRecords: CageCleanRecord[];
  rehabilitationRecords: RehabilitationRecord[];
  releaseRecords: ReleaseRecord[];
  adoptionApplications: AdoptionApplication[];
  statistics: StatisticsData;
  todos: TodoItem[];
  addAnimal: (animal: Animal) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  addTreatmentRecord: (record: TreatmentRecord) => void;
  addFeedingRecord: (record: FeedingRecord) => void;
  addCageCleanRecord: (record: CageCleanRecord) => void;
  addRehabilitationRecord: (record: RehabilitationRecord) => void;
  addReleaseRecord: (record: ReleaseRecord) => void;
  updateAdoptionApplication: (id: string, updates: Partial<AdoptionApplication>) => void;
  toggleTodo: (id: string) => void;
  getAnimalById: (id: string) => Animal | undefined;
  getTreatmentRecordsByAnimalId: (animalId: string) => TreatmentRecord[];
  getFeedingRecordsByAnimalId: (animalId: string) => FeedingRecord[];
  getRehabilitationRecordsByAnimalId: (animalId: string) => RehabilitationRecord[];
}

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export const AnimalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>(mockTreatmentRecords);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>(mockFeedingRecords);
  const [cageCleanRecords, setCageCleanRecords] = useState<CageCleanRecord[]>(mockCageCleanRecords);
  const [rehabilitationRecords, setRehabilitationRecords] = useState<RehabilitationRecord[]>(mockRehabilitationRecords);
  const [releaseRecords, setReleaseRecords] = useState<ReleaseRecord[]>(mockReleaseRecords);
  const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>(mockAdoptionApplications);
  const [statistics] = useState<StatisticsData>(mockStatistics);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);

  const addAnimal = (animal: Animal) => {
    setAnimals(prev => [animal, ...prev]);
  };

  const updateAnimal = (id: string, updates: Partial<Animal>) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updates, updateTime: new Date().toISOString() } : a));
  };

  const addTreatmentRecord = (record: TreatmentRecord) => {
    setTreatmentRecords(prev => [record, ...prev]);
  };

  const addFeedingRecord = (record: FeedingRecord) => {
    setFeedingRecords(prev => [record, ...prev]);
  };

  const addCageCleanRecord = (record: CageCleanRecord) => {
    setCageCleanRecords(prev => [record, ...prev]);
  };

  const addRehabilitationRecord = (record: RehabilitationRecord) => {
    setRehabilitationRecords(prev => [record, ...prev]);
  };

  const addReleaseRecord = (record: ReleaseRecord) => {
    setReleaseRecords(prev => [record, ...prev]);
  };

  const updateAdoptionApplication = (id: string, updates: Partial<AdoptionApplication>) => {
    setAdoptionApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const getAnimalById = (id: string) => {
    return animals.find(a => a.id === id);
  };

  const getTreatmentRecordsByAnimalId = (animalId: string) => {
    return treatmentRecords.filter(r => r.animalId === animalId);
  };

  const getFeedingRecordsByAnimalId = (animalId: string) => {
    return feedingRecords.filter(r => r.animalId === animalId);
  };

  const getRehabilitationRecordsByAnimalId = (animalId: string) => {
    return rehabilitationRecords.filter(r => r.animalId === animalId);
  };

  return (
    <AnimalContext.Provider value={{
      animals,
      treatmentRecords,
      feedingRecords,
      cageCleanRecords,
      rehabilitationRecords,
      releaseRecords,
      adoptionApplications,
      statistics,
      todos,
      addAnimal,
      updateAnimal,
      addTreatmentRecord,
      addFeedingRecord,
      addCageCleanRecord,
      addRehabilitationRecord,
      addReleaseRecord,
      updateAdoptionApplication,
      toggleTodo,
      getAnimalById,
      getTreatmentRecordsByAnimalId,
      getFeedingRecordsByAnimalId,
      getRehabilitationRecordsByAnimalId
    }}>
      {children}
    </AnimalContext.Provider>
  );
};

export const useAnimal = () => {
  const context = useContext(AnimalContext);
  if (!context) {
    throw new Error('useAnimal must be used within an AnimalProvider');
  }
  return context;
};
