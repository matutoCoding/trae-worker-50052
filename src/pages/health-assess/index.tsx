import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { HealthLevel } from '../../types/animal';
import { formatDate } from '../../utils';
import styles from './index.module.scss';

const HealthAssessPage: React.FC = () => {
  const { animals, updateAnimal } = useAnimal();
  const router = useRouter();

  useDidShow(() => {
    console.log('[HealthAssessPage] Page shown');
  });

  const availableAnimals = useMemo(
    () => animals.filter(a => a.status !== 'released' && a.status !== 'adopted'),
    [animals]
  );

  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [healthLevel, setHealthLevel] = useState<HealthLevel>('B');
  const [injuryDescription, setInjuryDescription] = useState('');
  const [isQuarantine, setIsQuarantine] = useState(false);
  const [quarantineEndDate, setQuarantineEndDate] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  useEffect(() => {
    const animalId = router.params.animalId;
    if (animalId) {
      const animal = animals.find(a => a.id === animalId);
      if (animal) {
        setSelectedAnimalId(animal.id);
        setHealthLevel(animal.healthLevel);
        setInjuryDescription(animal.injuryDescription || '');
        setIsQuarantine(animal.isQuarantine || false);
        setQuarantineEndDate(animal.quarantineEndDate || '');
        setTreatmentPlan(animal.treatmentPlan || '');
      }
    }
  }, [router.params.animalId, animals]);

  const assessedAnimals = useMemo(() => {
    return animals
      .filter(a => a.updateTime && a.healthLevel)
      .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      .slice(0, 10);
  }, [animals]);

  const selectedAnimal = availableAnimals.find(a => a.id === selectedAnimalId);

  const handleAnimalChange = (e) => {
    const idx = e.detail.value;
    if (idx >= 0 && idx < availableAnimals.length) {
      const animal = availableAnimals[idx];
      setSelectedAnimalId(animal.id);
      setHealthLevel(animal.healthLevel);
      setInjuryDescription(animal.injuryDescription || '');
      setIsQuarantine(animal.isQuarantine || false);
      setQuarantineEndDate(animal.quarantineEndDate || '');
      setTreatmentPlan(animal.treatmentPlan || '');
    }
  };

  const handleSubmit = () => {
    if (!selectedAnimalId) {
      Taro.showToast({ title: '请选择动物', icon: 'none' });
      return;
    }

    const updates: Record<string, any> = {
      healthLevel,
      injuryDescription,
      isQuarantine,
      treatmentPlan,
    };

    if (isQuarantine && quarantineEndDate) {
      updates.quarantineEndDate = quarantineEndDate;
      if (selectedAnimal && selectedAnimal.status !== 'quarantine') {
        updates.status = 'quarantine';
      }
    } else if (!isQuarantine) {
      updates.quarantineEndDate = '';
    }

    updateAnimal(selectedAnimalId, updates);
    Taro.showToast({ title: '评估已保存', icon: 'success' });

    setSelectedAnimalId('');
    setHealthLevel('B');
    setInjuryDescription('');
    setIsQuarantine(false);
    setQuarantineEndDate('');
    setTreatmentPlan('');
  };

  const healthOptions = [
    { key: 'A' as HealthLevel, label: 'A级（健康）' },
    { key: 'B' as HealthLevel, label: 'B级（轻伤）' },
    { key: 'C' as HealthLevel, label: 'C级（重伤）' },
    { key: 'D' as HealthLevel, label: 'D级（危重）' },
  ];

  const healthLevelColor = (level: HealthLevel) => {
    const map: Record<HealthLevel, string> = {
      A: '#00B42A',
      B: '#FF7D00',
      C: '#F53F3F',
      D: '#7B1FA2',
    };
    return map[level];
  };

  const pickerNames = availableAnimals.map(a => `${a.name}（${a.species}）`);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>健康评估</Text>
        <Text className={styles.subtitle}>对新接收动物进行全面健康检查</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>选择动物</Text>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择评估动物
            </Text>
            <Picker mode="selector" range={pickerNames} onChange={handleAnimalChange}>
              <View className={styles.animalSelector}>
                <Text className={selectedAnimalId ? styles.selectorText : styles.selectorPlaceholder}>
                  {selectedAnimal ? `${selectedAnimal.name}（${selectedAnimal.species}）` : '请选择需要评估的动物'}
                </Text>
                <Text className={styles.selectorArrow}>▾</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>健康评估</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>健康等级
            </Text>
            <View className={styles.selectRow}>
              {healthOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${healthLevel === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => setHealthLevel(option.key)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>伤情描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请详细描述动物的伤情，包括受伤部位、程度等"
              value={injuryDescription}
              onInput={(e) => setInjuryDescription(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>是否隔离观察</Text>
            <View className={styles.selectRow}>
              <View
                className={`${styles.selectItem} ${isQuarantine ? styles.selectItemActive : ''}`}
                onClick={() => setIsQuarantine(true)}
              >
                <Text>是</Text>
              </View>
              <View
                className={`${styles.selectItem} ${!isQuarantine ? styles.selectItemActive : ''}`}
                onClick={() => setIsQuarantine(false)}
              >
                <Text>否</Text>
              </View>
            </View>
          </View>

          {isQuarantine && (
            <View className={styles.formItem}>
              <Text className={styles.label}>隔离结束日期</Text>
              <Input
                className={styles.input}
                type="text"
                placeholder="如：2026-07-01"
                value={quarantineEndDate}
                onInput={(e) => setQuarantineEndDate(e.detail.value)}
              />
            </View>
          )}

          <View className={styles.formItem}>
            <Text className={styles.label}>治疗方案</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请填写治疗方案及用药说明"
              value={treatmentPlan}
              onInput={(e) => setTreatmentPlan(e.detail.value)}
            />
          </View>
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>保存评估</Text>
        </Button>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>最近评估记录</Text>
          {assessedAnimals.length === 0 ? (
            <View className={styles.emptyTip}>
              <Text className={styles.emptyTipText}>暂无评估记录</Text>
            </View>
          ) : (
            <View className={styles.assessList}>
              {assessedAnimals.map(animal => (
                <View key={animal.id} className={styles.assessItem}>
                  <View className={styles.assessInfo}>
                    <Text className={styles.assessName}>{animal.name}</Text>
                    <Text className={styles.assessSpecies}>{animal.species}</Text>
                  </View>
                  <View className={styles.assessRight}>
                    <Text
                      className={styles.healthBadge}
                      style={{ background: healthLevelColor(animal.healthLevel) }}
                    >
                      {animal.healthLevel}级
                    </Text>
                    <Text className={styles.assessDate}>
                      {formatDate(animal.updateTime)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HealthAssessPage;
