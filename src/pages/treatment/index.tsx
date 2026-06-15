import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import AnimalCard from '../../components/AnimalCard';
import { AnimalStatus, TreatmentRecord } from '../../types/animal';
import { getTreatmentTypeText } from '../../utils';
import styles from './index.module.scss';

type FilterType = 'all' | AnimalStatus;

const TreatmentPage: React.FC = () => {
  const { animals, treatmentRecords } = useAnimal();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(() => {
    console.log('[TreatmentPage] Page shown');
  });

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const handleRefresh = () => {
    setRefreshing(true);
    console.log('[TreatmentPage] Pull to refresh');
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'critical', label: '重症' },
    { key: 'treating', label: '治疗中' },
    { key: 'quarantine', label: '隔离观察' },
    { key: 'recovered', label: '已康复' },
    { key: 'healthy', label: '健康' },
  ];

  const getFilterCount = (key: FilterType) => {
    if (key === 'all') return animals.filter(a => a.status !== 'released' && a.status !== 'adopted').length;
    return animals.filter(a => a.status === key).length;
  };

  const filteredAnimals = useMemo(() => {
    let result = animals.filter(a => a.status !== 'released' && a.status !== 'adopted');
    if (activeFilter !== 'all') {
      result = result.filter(a => a.status === activeFilter);
    }
    return result.sort((a, b) => new Date(b.receiveDate).getTime() - new Date(a.receiveDate).getTime());
  }, [animals, activeFilter]);

  const recentTreatments = useMemo(() => {
    return [...treatmentRecords]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [treatmentRecords]);

  const handleFilterChange = (key: FilterType) => {
    console.log('[TreatmentPage] Filter changed to:', key);
    setActiveFilter(key);
  };

  const handleQuickAction = (path: string) => {
    console.log('[TreatmentPage] Navigate to:', path);
    Taro.navigateTo({ url: path }).catch(err => {
      console.error('[TreatmentPage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const getTimelineDotClass = (type: string) => {
    const classMap: Record<string, string> = {
      check: styles.timelineDotCheck,
      medication: styles.timelineDotMedication,
      surgery: styles.timelineDotSurgery,
      vaccination: styles.timelineDotVaccination
    };
    return classMap[type] || '';
  };

  const getTimelineTypeClass = (type: string) => {
    const classMap: Record<string, string> = {
      check: styles.timelineTypeCheck,
      medication: styles.timelineTypeMedication,
      surgery: styles.timelineTypeSurgery,
      vaccination: styles.timelineTypeVaccination
    };
    return classMap[type] || '';
  };

  const getAnimalName = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || '未知';
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          title='正在刷新...'
          color='#2E7D32'
        />
      }
    >
      <View className={styles.filterBar}>
        <ScrollView className={styles.filterScroll} scrollX>
          <View className={styles.filterContainer}>
            {filters.map(filter => (
              <View
                key={filter.key}
                className={`${styles.filterItem} ${activeFilter === filter.key ? styles.filterItemActive : ''}`}
                onClick={() => handleFilterChange(filter.key)}
              >
                <Text className={styles.filterText}>{filter.label}</Text>
                <Text className={styles.filterCount}>{getFilterCount(filter.key)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.content}>
        <View className={styles.quickActions}>
          <View className={`${styles.quickCard} ${styles.quickCard1}`} onClick={() => handleQuickAction('/pages/health-assess/index')}>
            <Text className={styles.quickIcon}>🏥</Text>
            <Text className={styles.quickTitle}>健康评估</Text>
            <Text className={styles.quickDesc}>伤情评定</Text>
          </View>
          <View className={`${styles.quickCard} ${styles.quickCard2}`} onClick={() => handleQuickAction('/pages/treatment-record/index')}>
            <Text className={styles.quickIcon}>💊</Text>
            <Text className={styles.quickTitle}>治疗记录</Text>
            <Text className={styles.quickDesc}>诊疗用药</Text>
          </View>
          <View className={`${styles.quickCard} ${styles.quickCard3}`} onClick={() => handleQuickAction('/pages/rehab-assess/index')}>
            <Text className={styles.quickIcon}>💪</Text>
            <Text className={styles.quickTitle}>康复评估</Text>
            <Text className={styles.quickDesc}>康复训练</Text>
          </View>
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>动物列表</Text>
          <View className={styles.moreBtn} onClick={() => Taro.showToast({ title: '更多功能开发中', icon: 'none' })}>
            <Text>更多</Text>
            <Text>›</Text>
          </View>
        </View>

        {filteredAnimals.length > 0 ? (
          filteredAnimals.map(animal => (
            <AnimalCard key={animal.id} animal={animal} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🐾</Text>
            <Text className={styles.emptyText}>暂无符合条件的动物</Text>
          </View>
        )}

        <View className={styles.sectionHeader} style={{ marginTop: styles.spacingLg }}>
          <Text className={styles.sectionTitle}>最近治疗记录</Text>
          <View className={styles.moreBtn} onClick={() => Taro.showToast({ title: '更多功能开发中', icon: 'none' })}>
            <Text>全部</Text>
            <Text>›</Text>
          </View>
        </View>

        <View className={styles.timeline}>
          {recentTreatments.length > 0 ? (
            recentTreatments.map((record: TreatmentRecord) => (
              <View key={record.id} className={styles.timelineItem}>
                <View className={`${styles.timelineDot} ${getTimelineDotClass(record.type)}`} />
                <View className={styles.timelineContent}>
                  <View className={styles.timelineHeader}>
                    <Text className={`${styles.timelineType} ${getTimelineTypeClass(record.type)}`}>
                      {getTreatmentTypeText(record.type)}
                    </Text>
                    <Text className={styles.timelineDate}>{record.date}</Text>
                  </View>
                  <Text className={styles.timelineTitle}>{record.title}</Text>
                  <View className={styles.timelineMeta}>
                    <Text className={styles.timelineMetaItem}>
                      <Text className={styles.timelineMetaIcon}>🐾</Text>
                      {getAnimalName(record.animalId)}
                    </Text>
                    <Text className={styles.timelineMetaItem}>
                      <Text className={styles.timelineMetaIcon}>👨‍⚕️</Text>
                      {record.veterinarian}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无治疗记录</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default TreatmentPage;
