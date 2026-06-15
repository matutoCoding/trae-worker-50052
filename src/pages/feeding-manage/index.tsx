import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { FeedingRecord, CageCleanRecord } from '../../types/animal';
import { generateId, formatDate } from '../../utils';
import styles from './index.module.scss';

type TabType = 'feeding' | 'clean';

const APPETITE_OPTIONS = [
  { key: 'good', label: '良好' },
  { key: 'normal', label: '一般' },
  { key: 'poor', label: '不佳' },
];

const DISINFECTION_OPTIONS = ['是', '否'];

const FeedingManagePage: React.FC = () => {
  const { animals, feedingRecords, cageCleanRecords, addFeedingRecord, addCageCleanRecord } = useAnimal();
  const [activeTab, setActiveTab] = useState<TabType>('feeding');

  const [feedingAnimalIndex, setFeedingAnimalIndex] = useState(-1);
  const [feedingForm, setFeedingForm] = useState({
    time: '',
    foodType: '',
    quantity: '',
    feeder: '',
    appetite: 'good' as 'good' | 'normal' | 'poor',
    notes: '',
  });

  const [cleanCageNumber, setCleanCageNumber] = useState('');
  const [cleanAnimalIndex, setCleanAnimalIndex] = useState(-1);
  const [cleanForm, setCleanForm] = useState({
    cleaner: '',
    disinfection: true,
    notes: '',
  });

  useDidShow(() => {
    console.log('[FeedingManagePage] Page shown');
  });

  const animalPickerRange = animals.map(a => `${a.name}（${a.species}）`);

  const todayFeeding = useMemo(() => {
    const today = formatDate(new Date());
    return feedingRecords
      .filter(r => r.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [feedingRecords]);

  const todayClean = useMemo(() => {
    const today = formatDate(new Date());
    return cageCleanRecords.filter(r => r.date === today);
  }, [cageCleanRecords]);

  const getAnimalName = (animalId?: string) => {
    if (!animalId) return '空笼舍';
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || '未知';
  };

  const getAppetiteText = (appetite: string) => {
    const map: Record<string, string> = { good: '良好', normal: '一般', poor: '不佳' };
    return map[appetite] || appetite;
  };

  const handleFeedingAnimalPick = (e) => {
    const idx = Number(e.detail.value);
    setFeedingAnimalIndex(idx);
  };

  const handleFeedingAppetiteSelect = (key: 'good' | 'normal' | 'poor') => {
    setFeedingForm(prev => ({ ...prev, appetite: key }));
  };

  const handleFeedingSubmit = () => {
    if (feedingAnimalIndex < 0 || !feedingForm.time || !feedingForm.foodType || !feedingForm.quantity || !feedingForm.feeder) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }
    const record: FeedingRecord = {
      id: generateId(),
      animalId: animals[feedingAnimalIndex].id,
      date: formatDate(new Date()),
      time: feedingForm.time,
      foodType: feedingForm.foodType,
      quantity: feedingForm.quantity,
      feeder: feedingForm.feeder,
      appetite: feedingForm.appetite,
      notes: feedingForm.notes || undefined,
    };
    addFeedingRecord(record);
    Taro.showToast({ title: '投喂记录已保存', icon: 'success' });
    setFeedingAnimalIndex(-1);
    setFeedingForm({ time: '', foodType: '', quantity: '', feeder: '', appetite: 'good', notes: '' });
  };

  const handleCleanDisinfectionSelect = (val: string) => {
    setCleanForm(prev => ({ ...prev, disinfection: val === '是' }));
  };

  const handleCleanSubmit = () => {
    if (!cleanCageNumber || !cleanForm.cleaner) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }
    const record: CageCleanRecord = {
      id: generateId(),
      cageNumber: cleanCageNumber,
      animalId: cleanAnimalIndex >= 0 ? animals[cleanAnimalIndex].id : undefined,
      date: formatDate(new Date()),
      cleaner: cleanForm.cleaner,
      disinfection: cleanForm.disinfection,
      notes: cleanForm.notes || undefined,
    };
    addCageCleanRecord(record);
    Taro.showToast({ title: '清洁记录已保存', icon: 'success' });
    setCleanCageNumber('');
    setCleanAnimalIndex(-1);
    setCleanForm({ cleaner: '', disinfection: true, notes: '' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>饲养管理</Text>
        <Text className={styles.subtitle}>管理动物的日常饲养和笼舍清洁</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.tabs}>
          <View
            className={`${styles.tabItem} ${activeTab === 'feeding' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('feeding')}
          >
            <Text>投喂记录</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'clean' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('clean')}
          >
            <Text>清洁记录</Text>
          </View>
        </View>

        {activeTab === 'feeding' ? (
          <>
            <View className={styles.formCard}>
              <Text className={styles.sectionTitle}>添加投喂记录</Text>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>选择动物
                </Text>
                <Picker mode='selector' range={animalPickerRange} value={feedingAnimalIndex} onChange={handleFeedingAnimalPick}>
                  <View className={styles.pickerValue}>
                    <Text className={feedingAnimalIndex >= 0 ? styles.pickerText : styles.pickerPlaceholder}>
                      {feedingAnimalIndex >= 0 ? animalPickerRange[feedingAnimalIndex] : '请选择动物'}
                    </Text>
                    <Text className={styles.pickerArrow}>▼</Text>
                  </View>
                </Picker>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>投喂时间
                </Text>
                <Input
                  className={styles.input}
                  placeholder='如：08:30'
                  value={feedingForm.time}
                  onInput={(e) => setFeedingForm(prev => ({ ...prev, time: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>食物类型
                </Text>
                <Input
                  className={styles.input}
                  placeholder='如：鸡肉、水果等'
                  value={feedingForm.foodType}
                  onInput={(e) => setFeedingForm(prev => ({ ...prev, foodType: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>食物量
                </Text>
                <Input
                  className={styles.input}
                  placeholder='如：200g'
                  value={feedingForm.quantity}
                  onInput={(e) => setFeedingForm(prev => ({ ...prev, quantity: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>饲养员
                </Text>
                <Input
                  className={styles.input}
                  placeholder='请输入饲养员姓名'
                  value={feedingForm.feeder}
                  onInput={(e) => setFeedingForm(prev => ({ ...prev, feeder: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>食欲</Text>
                <View className={styles.selectRow}>
                  {APPETITE_OPTIONS.map(option => (
                    <View
                      key={option.key}
                      className={`${styles.selectItem} ${feedingForm.appetite === option.key ? styles.selectItemActive : ''}`}
                      onClick={() => handleFeedingAppetiteSelect(option.key as 'good' | 'normal' | 'poor')}
                    >
                      <Text>{option.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>备注</Text>
                <Textarea
                  className={styles.textarea}
                  placeholder='其他备注信息'
                  value={feedingForm.notes}
                  onInput={(e) => setFeedingForm(prev => ({ ...prev, notes: e.detail.value }))}
                />
              </View>

              <Button className={styles.submitBtn} onClick={handleFeedingSubmit}>
                <Text className={styles.submitBtnText}>保存投喂记录</Text>
              </Button>
            </View>

            <View className={styles.recordSection}>
              <Text className={styles.sectionTitle}>今日投喂记录</Text>
              {todayFeeding.length > 0 ? (
                <View className={styles.recordList}>
                  {todayFeeding.map((record: FeedingRecord) => (
                    <View key={record.id} className={styles.recordItem}>
                      <View className={styles.recordMeta}>
                        <Text className={styles.recordTime}>{record.time}</Text>
                        <Text className={styles.recordName}>{getAnimalName(record.animalId)}</Text>
                      </View>
                      <View className={styles.recordDetail}>
                        <Text>{record.foodType} · {record.quantity}</Text>
                        <Text className={styles.recordAppetite}>食欲: {getAppetiteText(record.appetite)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyText}>今日暂无投喂记录</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View className={styles.formCard}>
              <Text className={styles.sectionTitle}>添加清洁记录</Text>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>笼舍编号
                </Text>
                <Input
                  className={styles.input}
                  placeholder='如：A-01'
                  value={cleanCageNumber}
                  onInput={(e) => setCleanCageNumber(e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>动物（可选）</Text>
                <Picker mode='selector' range={animalPickerRange} value={cleanAnimalIndex} onChange={(e) => setCleanAnimalIndex(Number(e.detail.value))}>
                  <View className={styles.pickerValue}>
                    <Text className={cleanAnimalIndex >= 0 ? styles.pickerText : styles.pickerPlaceholder}>
                      {cleanAnimalIndex >= 0 ? animalPickerRange[cleanAnimalIndex] : '请选择动物'}
                    </Text>
                    <Text className={styles.pickerArrow}>▼</Text>
                  </View>
                </Picker>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>清洁人员
                </Text>
                <Input
                  className={styles.input}
                  placeholder='请输入清洁人员姓名'
                  value={cleanForm.cleaner}
                  onInput={(e) => setCleanForm(prev => ({ ...prev, cleaner: e.detail.value }))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>是否消毒</Text>
                <View className={styles.selectRow}>
                  {DISINFECTION_OPTIONS.map(option => (
                    <View
                      key={option}
                      className={`${styles.selectItem} ${(option === '是') === cleanForm.disinfection ? styles.selectItemActive : ''}`}
                      onClick={() => handleCleanDisinfectionSelect(option)}
                    >
                      <Text>{option}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>备注</Text>
                <Textarea
                  className={styles.textarea}
                  placeholder='其他备注信息'
                  value={cleanForm.notes}
                  onInput={(e) => setCleanForm(prev => ({ ...prev, notes: e.detail.value }))}
                />
              </View>

              <Button className={styles.submitBtn} onClick={handleCleanSubmit}>
                <Text className={styles.submitBtnText}>保存清洁记录</Text>
              </Button>
            </View>

            <View className={styles.recordSection}>
              <Text className={styles.sectionTitle}>今日清洁记录</Text>
              {todayClean.length > 0 ? (
                <View className={styles.recordList}>
                  {todayClean.map((record: CageCleanRecord) => (
                    <View key={record.id} className={styles.recordItem}>
                      <View className={styles.recordMeta}>
                        <Text className={styles.recordCage}>{record.cageNumber}</Text>
                        <Text className={styles.recordName}>{getAnimalName(record.animalId)}</Text>
                      </View>
                      <View className={styles.recordDetail}>
                        <Text>清洁员: {record.cleaner}</Text>
                        <Text className={`${styles.disinfectionBadge} ${record.disinfection ? styles.disinfected : styles.notDisinfected}`}>
                          {record.disinfection ? '已消毒' : '未消毒'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyText}>今日暂无清洁记录</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default FeedingManagePage;
