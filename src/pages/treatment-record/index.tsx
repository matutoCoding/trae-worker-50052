import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { generateId, formatDate } from '../../utils';
import styles from './index.module.scss';

const TREATMENT_TYPE_OPTIONS = [
  { key: 'check', label: '常规检查' },
  { key: 'medication', label: '药物治疗' },
  { key: 'surgery', label: '手术治疗' },
  { key: 'vaccination', label: '疫苗接种' },
  { key: 'other', label: '其他' },
];

const TYPE_LABEL_MAP: Record<string, string> = {
  check: '常规检查',
  medication: '药物治疗',
  surgery: '手术治疗',
  vaccination: '疫苗接种',
  other: '其他',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  treating: '治疗中',
  critical: '危重',
  quarantine: '隔离中',
};

const TreatmentRecordPage: React.FC = () => {
  const { animals, addTreatmentRecord, getTreatmentRecordsByAnimalId } = useAnimal();

  useDidShow(() => {
    console.log('[TreatmentRecordPage] Page shown');
  });

  const filteredAnimals = useMemo(
    () => animals.filter(a => a.status === 'treating' || a.status === 'critical' || a.status === 'quarantine'),
    [animals]
  );

  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [animalPickerIndex, setAnimalPickerIndex] = useState(-1);
  const [formData, setFormData] = useState({
    type: 'check' as 'check' | 'medication' | 'surgery' | 'vaccination' | 'other',
    title: '',
    description: '',
    veterinarian: '',
    notes: '',
    nextFollowUp: '',
  });

  const selectedAnimal = useMemo(
    () => animals.find(a => a.id === selectedAnimalId),
    [animals, selectedAnimalId]
  );

  const treatmentRecords = useMemo(
    () => selectedAnimalId ? getTreatmentRecordsByAnimalId(selectedAnimalId) : [],
    [selectedAnimalId, getTreatmentRecordsByAnimalId]
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: typeof formData.type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleAnimalPick = (e: { detail: { value: number } }) => {
    const idx = e.detail.value;
    setAnimalPickerIndex(idx);
    setSelectedAnimalId(filteredAnimals[idx]?.id || '');
  };

  const handleSubmit = () => {
    if (!selectedAnimalId) {
      Taro.showToast({ title: '请选择动物', icon: 'none' });
      return;
    }
    if (!formData.title) {
      Taro.showToast({ title: '请填写治疗标题', icon: 'none' });
      return;
    }
    if (!formData.veterinarian) {
      Taro.showToast({ title: '请填写兽医姓名', icon: 'none' });
      return;
    }

    const record = {
      id: generateId(),
      animalId: selectedAnimalId,
      date: formatDate(new Date()),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      medicines: [],
      veterinarian: formData.veterinarian,
      notes: formData.notes || undefined,
      nextFollowUp: formData.nextFollowUp || undefined,
    };

    addTreatmentRecord(record);
    Taro.showToast({ title: '记录已保存', icon: 'success' });

    setFormData({
      type: 'check',
      title: '',
      description: '',
      veterinarian: '',
      notes: '',
      nextFollowUp: '',
    });
  };

  const animalPickerRange = filteredAnimals.map(a => `${a.name}（${a.species}）`);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>治疗记录</Text>
        <Text className={styles.subtitle}>记录动物的诊疗过程和用药情况</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>选择动物</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择动物
            </Text>
            {filteredAnimals.length > 0 ? (
              <Picker mode='selector' range={animalPickerRange} value={animalPickerIndex} onChange={handleAnimalPick}>
                <View className={styles.pickerValue}>
                  <Text className={animalPickerIndex >= 0 ? styles.pickerText : styles.pickerPlaceholder}>
                    {animalPickerIndex >= 0 ? animalPickerRange[animalPickerIndex] : '请选择动物'}
                  </Text>
                  <Text className={styles.pickerArrow}>▼</Text>
                </View>
              </Picker>
            ) : (
              <View className={styles.emptyHint}>
                <Text className={styles.emptyHintText}>暂无治疗中/危重/隔离的动物</Text>
              </View>
            )}
          </View>

          {selectedAnimal && (
            <View className={styles.animalInfo}>
              <Text className={styles.animalInfoText}>
                {selectedAnimal.species} · {STATUS_LABEL_MAP[selectedAnimal.status] || selectedAnimal.status}
              </Text>
            </View>
          )}
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>治疗信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>治疗类型
            </Text>
            <View className={styles.selectRow}>
              {TREATMENT_TYPE_OPTIONS.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${formData.type === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => handleTypeSelect(option.key as typeof formData.type)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>治疗标题
            </Text>
            <Input
              className={styles.input}
              placeholder='请输入治疗标题'
              value={formData.title}
              onInput={(e) => handleInputChange('title', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>治疗描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder='请详细描述治疗过程和情况'
              value={formData.description}
              onInput={(e) => handleInputChange('description', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>兽医姓名
            </Text>
            <Input
              className={styles.input}
              placeholder='请输入兽医姓名'
              value={formData.veterinarian}
              onInput={(e) => handleInputChange('veterinarian', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Textarea
              className={styles.textarea}
              placeholder='其他需要备注的信息'
              value={formData.notes}
              onInput={(e) => handleInputChange('notes', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>下次复诊日期</Text>
            <Input
              className={styles.input}
              type='date'
              placeholder='请选择复诊日期'
              value={formData.nextFollowUp}
              onInput={(e) => handleInputChange('nextFollowUp', e.detail.value)}
            />
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>保存记录</Text>
        </Button>

        {selectedAnimalId && treatmentRecords.length > 0 && (
          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>治疗记录时间线</Text>
            <View className={styles.timeline}>
              {treatmentRecords.map(record => (
                <View key={record.id} className={styles.timelineItem}>
                  <View className={styles.timelineDot} />
                  <View className={styles.timelineContent}>
                    <View className={styles.timelineHeader}>
                      <Text className={styles.timelineTitle}>{record.title}</Text>
                      <Text className={styles.timelineType}>{TYPE_LABEL_MAP[record.type] || record.type}</Text>
                    </View>
                    <Text className={styles.timelineDate}>{record.date}</Text>
                    {record.description ? (
                      <Text className={styles.timelineDesc}>{record.description}</Text>
                    ) : null}
                    <Text className={styles.timelineVet}>兽医：{record.veterinarian}</Text>
                    {record.nextFollowUp ? (
                      <Text className={styles.timelineFollowUp}>下次复诊：{record.nextFollowUp}</Text>
                    ) : null}
                    {record.notes ? (
                      <Text className={styles.timelineNotes}>备注：{record.notes}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedAnimalId && treatmentRecords.length === 0 && (
          <View className={styles.emptyTimeline}>
            <Text className={styles.emptyTimelineText}>暂无治疗记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TreatmentRecordPage;
