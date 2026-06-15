import { AnimalStatus } from '../types/animal';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const getStatusText = (status: AnimalStatus): string => {
  const statusMap: Record<AnimalStatus, string> = {
    healthy: '健康',
    treating: '治疗中',
    critical: '重症',
    recovered: '已康复',
    quarantine: '隔离观察',
    adoptable: '可领养',
    released: '已放归',
    adopted: '已领养'
  };
  return statusMap[status] || status;
};

export const getStatusTagClass = (status: AnimalStatus): string => {
  const classMap: Record<AnimalStatus, string> = {
    healthy: 'tagSuccess',
    treating: 'tagWarning',
    critical: 'tagError',
    recovered: 'tagInfo',
    quarantine: 'tagQuarantine',
    adoptable: 'tagAccent',
    released: 'tagPrimary',
    adopted: 'tagPrimary'
  };
  return classMap[status] || 'tagInfo';
};

export const getSourceText = (source: string): string => {
  const sourceMap: Record<string, string> = {
    rescue: '野外救助',
    donation: '群众捐赠',
    transfer: '机构转来',
    other: '其他来源'
  };
  return sourceMap[source] || source;
};

export const getGenderText = (gender: string): string => {
  const genderMap: Record<string, string> = {
    male: '雄性',
    female: '雌性',
    unknown: '未知'
  };
  return genderMap[gender] || gender;
};

export const getTreatmentTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    check: '常规检查',
    medication: '药物治疗',
    surgery: '手术治疗',
    vaccination: '疫苗接种',
    other: '其他'
  };
  return typeMap[type] || type;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const daysBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};

export const getDaysInShelter = (receiveDate: string): number => {
  return daysBetween(receiveDate, new Date());
};
