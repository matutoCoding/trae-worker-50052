import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { RehabilitationRecord } from '../../types/animal';
import { formatDate, generateId } from '../../utils';
import styles from './index.module.scss';

const performanceOptions = [
  { key: 'excellent' as const, label: '优秀' },
  { key: 'good' as const, label: '良好' },
  { key: 'fair' as const, label: '一般' },
  { key: 'poor' as const, label: '较差' },
];

const performanceLabel = (p: RehabilitationRecord['performance']) => {
  return performanceOptions.find(o => o.key === p)?.label || p;
};

const performanceColor = (p: RehabilitationRecord['performance']) => {
  const map: Record<RehabilitationRecord['performance'], string> = {
    excellent: '#00B42A',
    good: '#168FFF',
    fair: '#FF7D00',
    poor: '#F53F3F',
  };
  return map[p];
};

const RehabAssessPage: React.FC = () => {
  const {
    animals,
    rehabilitationRecords,
    addRehabilitationRecord,
    updateAnimal,
    getRehabilitationRecordsByAnimalId,
  } = useAnimal();

  useDidShow(() => {
    console.log('[RehabAssessPage] Page shown');
  });

  const availableAnimals = useMemo(
    () => animals.filter(a => ['treating', 'recovered', 'healthy'].includes(a.status)),
    [animals]
  );

  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [duration, setDuration] = useState('');
  const [performance, setPerformance] = useState<RehabilitationRecord['performance']>('good');
  const [trainer, setTrainer] = useState('');
  const [notes, setNotes] = useState('');

  const selectedAnimal = availableAnimals.find(a => a.id === selectedAnimalId);

  const animalRecords = useMemo(() => {
    if (!selectedAnimalId) return [];
    return getRehabilitationRecordsByAnimalId(selectedAnimalId);
  }, [selectedAnimalId, rehabilitationRecords, getRehabilitationRecordsByAnimalId]);

  const pickerNames = availableAnimals.map(a => `${a.name}（${a.species}）`);

  const handleAnimalChange = (e) => {
    const idx = e.detail.value;
    if (idx >= 0 && idx < availableAnimals.length) {
      setSelectedAnimalId(availableAnimals[idx].id);
    }
  };

  const handleReset = () => {
    setTrainingType('');
    setDuration('');
    setPerformance('good');
    setTrainer('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!selectedAnimalId) {
      Taro.showToast({ title: '请选择动物', icon: 'none' });
      return;
    }
    if (!trainingType.trim()) {
      Taro.showToast({ title: '请输入训练类型', icon: 'none' });
      return;
    }
    if (!duration || Number(duration) <= 0) {
      Taro.showToast({ title: '请输入有效训练时长', icon: 'none' });
      return;
    }
    if (!trainer.trim()) {
      Taro.showToast({ title: '请输入训练师', icon: 'none' });
      return;
    }

    const record: RehabilitationRecord = {
      id: generateId(),
      animalId: selectedAnimalId,
      date: new Date().toISOString(),
      trainingType: trainingType.trim(),
      duration: Number(duration),
      performance,
      trainer: trainer.trim(),
      notes: notes.trim() || undefined,
    };

    addRehabilitationRecord(record);

    if (selectedAnimal && selectedAnimal.status === 'treating') {
      Taro.showModal({
        title: '提示',
        content: '该动物当前状态为"治疗中"，是否将其更新为"已康复"状态？',
        confirmText: '更新状态',
        cancelText: '暂不更新',
        success: (res) => {
          if (res.confirm) {
            updateAnimal(selectedAnimalId, { status: 'recovered' });
            Taro.showToast({ title: '状态已更新', icon: 'success' });
          } else {
            Taro.showToast({ title: '记录已保存', icon: 'success' });
          }
        },
      });
    } else {
      Taro.showToast({ title: '记录已保存', icon: 'success' });
    }

    handleReset();
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>康复评估</Text>
        <Text className={styles.subtitle}>跟踪动物康复过程和野化训练</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>选择动物</Text>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择动物
            </Text>
            <Picker mode="selector" range={pickerNames} onChange={handleAnimalChange}>
              <View className={styles.animalSelector}>
                <Text className={selectedAnimalId ? styles.selectorText : styles.selectorPlaceholder}>
                  {selectedAnimal ? `${selectedAnimal.name}（${selectedAnimal.species}）` : '请选择动物'}
                </Text>
                <Text className={styles.selectorArrow}>▾</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>康复训练记录</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>训练类型
            </Text>
            <Input
              className={styles.input}
              type="text"
              placeholder="如：关节活动训练/野外觅食训练/飞行训练等"
              value={trainingType}
              onInput={(e) => setTrainingType(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>训练时长（分钟）
            </Text>
            <Input
              className={styles.input}
              type="digit"
              placeholder="请输入训练时长"
              value={duration}
              onInput={(e) => setDuration(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>表现评估
            </Text>
            <View className={styles.selectRow}>
              {performanceOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${performance === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => setPerformance(option.key)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>训练师
            </Text>
            <Input
              className={styles.input}
              type="text"
              placeholder="请输入训练师姓名"
              value={trainer}
              onInput={(e) => setTrainer(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请输入备注信息"
              value={notes}
              onInput={(e) => setNotes(e.detail.value)}
            />
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>保存记录</Text>
        </Button>

        {selectedAnimalId && (
          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>康复训练记录</Text>
            {animalRecords.length === 0 ? (
              <View className={styles.emptyTip}>
                <Text className={styles.emptyTipText}>暂无训练记录</Text>
              </View>
            ) : (
              <View className={styles.recordList}>
                {animalRecords.map(record => (
                  <View key={record.id} className={styles.recordItem}>
                    <View className={styles.recordTop}>
                      <Text className={styles.recordType}>{record.trainingType}</Text>
                      <Text
                        className={styles.performanceTag}
                        style={{ background: performanceColor(record.performance) }}
                      >
                        {performanceLabel(record.performance)}
                      </Text>
                    </View>
                    <View className={styles.recordBottom}>
                      <Text className={styles.recordDate}>{formatDate(record.date)}</Text>
                      <Text className={styles.recordDuration}>{record.duration}分钟</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default RehabAssessPage;
