import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  Animal,
  TreatmentRecord,
  FeedingRecord,
  CageCleanRecord,
  RehabilitationRecord,
  ReleaseRecord,
  TrackRecord,
  AdoptionApplication,
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
  mockTodos
} from '../data/mockData';

const STORAGE_KEYS = {
  animals: 'wrs_animals',
  treatmentRecords: 'wrs_treatment_records',
  feedingRecords: 'wrs_feeding_records',
  cageCleanRecords: 'wrs_cage_clean_records',
  rehabilitationRecords: 'wrs_rehab_records',
  releaseRecords: 'wrs_release_records',
  adoptionApplications: 'wrs_adoption_applications',
  todos: 'wrs_todos',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('[Storage] Failed to load:', key, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('[Storage] Failed to save:', key, e);
  }
}

interface AnimalContextType {
  animals: Animal[];
  treatmentRecords: TreatmentRecord[];
  feedingRecords: FeedingRecord[];
  cageCleanRecords: CageCleanRecord[];
  rehabilitationRecords: RehabilitationRecord[];
  releaseRecords: ReleaseRecord[];
  adoptionApplications: AdoptionApplication[];
  todos: TodoItem[];
  addAnimal: (animal: Animal) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  addTreatmentRecord: (record: TreatmentRecord) => void;
  addFeedingRecord: (record: FeedingRecord) => void;
  addCageCleanRecord: (record: CageCleanRecord) => void;
  addRehabilitationRecord: (record: RehabilitationRecord) => void;
  addReleaseRecord: (record: ReleaseRecord) => void;
  addTrackRecord: (releaseId: string, track: TrackRecord) => void;
  addAdoptionApplication: (app: AdoptionApplication) => void;
  updateAdoptionApplication: (id: string, updates: Partial<AdoptionApplication>) => void;
  toggleTodo: (id: string) => void;
  getAnimalById: (id: string) => Animal | undefined;
  getTreatmentRecordsByAnimalId: (animalId: string) => TreatmentRecord[];
  getFeedingRecordsByAnimalId: (animalId: string) => FeedingRecord[];
  getRehabilitationRecordsByAnimalId: (animalId: string) => RehabilitationRecord[];
  getReleaseRecordsByAnimalId: (animalId: string) => ReleaseRecord[];
  statistics: {
    totalAnimals: number;
    treatingCount: number;
    healthyCount: number;
    adoptableCount: number;
    releasedCount: number;
    adoptedCount: number;
    monthlyRescue: number[];
    speciesDistribution: { name: string; value: number }[];
  };
}

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export const AnimalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>(() => loadFromStorage(STORAGE_KEYS.animals, mockAnimals));
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>(() => loadFromStorage(STORAGE_KEYS.treatmentRecords, mockTreatmentRecords));
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>(() => loadFromStorage(STORAGE_KEYS.feedingRecords, mockFeedingRecords));
  const [cageCleanRecords, setCageCleanRecords] = useState<CageCleanRecord[]>(() => loadFromStorage(STORAGE_KEYS.cageCleanRecords, mockCageCleanRecords));
  const [rehabilitationRecords, setRehabilitationRecords] = useState<RehabilitationRecord[]>(() => loadFromStorage(STORAGE_KEYS.rehabilitationRecords, mockRehabilitationRecords));
  const [releaseRecords, setReleaseRecords] = useState<ReleaseRecord[]>(() => loadFromStorage(STORAGE_KEYS.releaseRecords, mockReleaseRecords));
  const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>(() => loadFromStorage(STORAGE_KEYS.adoptionApplications, mockAdoptionApplications));
  const [todos, setTodos] = useState<TodoItem[]>(() => loadFromStorage(STORAGE_KEYS.todos, mockTodos));

  useEffect(() => { saveToStorage(STORAGE_KEYS.animals, animals); }, [animals]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.treatmentRecords, treatmentRecords); }, [treatmentRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.feedingRecords, feedingRecords); }, [feedingRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.cageCleanRecords, cageCleanRecords); }, [cageCleanRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.rehabilitationRecords, rehabilitationRecords); }, [rehabilitationRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.releaseRecords, releaseRecords); }, [releaseRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.adoptionApplications, adoptionApplications); }, [adoptionApplications]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.todos, todos); }, [todos]);

  const addAnimal = useCallback((animal: Animal) => {
    setAnimals(prev => [animal, ...prev]);
  }, []);

  const updateAnimal = useCallback((id: string, updates: Partial<Animal>) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updates, updateTime: new Date().toISOString() } : a));
  }, []);

  const addTreatmentRecord = useCallback((record: TreatmentRecord) => {
    setTreatmentRecords(prev => [record, ...prev]);
  }, []);

  const addFeedingRecord = useCallback((record: FeedingRecord) => {
    setFeedingRecords(prev => [record, ...prev]);
  }, []);

  const addCageCleanRecord = useCallback((record: CageCleanRecord) => {
    setCageCleanRecords(prev => [record, ...prev]);
  }, []);

  const addRehabilitationRecord = useCallback((record: RehabilitationRecord) => {
    setRehabilitationRecords(prev => [record, ...prev]);
  }, []);

  const addReleaseRecord = useCallback((record: ReleaseRecord) => {
    setReleaseRecords(prev => [record, ...prev]);
  }, []);

  const addTrackRecord = useCallback((releaseId: string, track: TrackRecord) => {
    setReleaseRecords(prev => prev.map(r =>
      r.id === releaseId ? { ...r, trackRecords: [...r.trackRecords, track] } : r
    ));
  }, []);

  const addAdoptionApplication = useCallback((app: AdoptionApplication) => {
    setAdoptionApplications(prev => [app, ...prev]);
  }, []);

  const updateAdoptionApplication = useCallback((id: string, updates: Partial<AdoptionApplication>) => {
    setAdoptionApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  }, []);

  const getAnimalById = useCallback((id: string) => {
    return animals.find(a => a.id === id);
  }, [animals]);

  const getTreatmentRecordsByAnimalId = useCallback((animalId: string) => {
    return treatmentRecords.filter(r => r.animalId === animalId);
  }, [treatmentRecords]);

  const getFeedingRecordsByAnimalId = useCallback((animalId: string) => {
    return feedingRecords.filter(r => r.animalId === animalId);
  }, [feedingRecords]);

  const getRehabilitationRecordsByAnimalId = useCallback((animalId: string) => {
    return rehabilitationRecords.filter(r => r.animalId === animalId);
  }, [rehabilitationRecords]);

  const getReleaseRecordsByAnimalId = useCallback((animalId: string) => {
    return releaseRecords.filter(r => r.animalId === animalId);
  }, [releaseRecords]);

  const statistics = useMemo(() => {
    const treatingCount = animals.filter(a => a.status === 'treating' || a.status === 'critical' || a.status === 'quarantine').length;
    const healthyCount = animals.filter(a => a.status === 'healthy' || a.status === 'recovered').length;
    const adoptableCount = animals.filter(a => a.adoptable && a.status !== 'adopted').length;
    const releasedCount = animals.filter(a => a.status === 'released').length;
    const adoptedCount = animals.filter(a => a.status === 'adopted').length;
    const speciesMap: Record<string, number> = {};
    animals.forEach(a => {
      const category = ['狐狸', '猴子', '鹿', '熊', '猫科', '兔子'].includes(a.species) ? '兽类'
        : ['大雁', '鸟类', '猫头鹰'].includes(a.species) ? '鸟类'
        : ['乌龟', '爬行类'].includes(a.species) ? '爬行类' : '其他';
      speciesMap[category] = (speciesMap[category] || 0) + 1;
    });
    const speciesDistribution = Object.entries(speciesMap).map(([name, value]) => ({ name, value }));
    return {
      totalAnimals: animals.length,
      treatingCount,
      healthyCount,
      adoptableCount,
      releasedCount,
      adoptedCount,
      monthlyRescue: [8, 12, 6, 10, 15, animals.length],
      speciesDistribution
    };
  }, [animals]);

  return (
    <AnimalContext.Provider value={{
      animals,
      treatmentRecords,
      feedingRecords,
      cageCleanRecords,
      rehabilitationRecords,
      releaseRecords,
      adoptionApplications,
      todos,
      statistics,
      addAnimal,
      updateAnimal,
      addTreatmentRecord,
      addFeedingRecord,
      addCageCleanRecord,
      addRehabilitationRecord,
      addReleaseRecord,
      addTrackRecord,
      addAdoptionApplication,
      updateAdoptionApplication,
      toggleTodo,
      getAnimalById,
      getTreatmentRecordsByAnimalId,
      getFeedingRecordsByAnimalId,
      getRehabilitationRecordsByAnimalId,
      getReleaseRecordsByAnimalId
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
