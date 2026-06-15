import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { FeedingRecord, CageCleanRecord } from '../../types/animal';
import styles from './index.module.scss';

type TabType = 'feeding' | 'clean';

const FeedingPage: React.FC = () => {
  const { animals, feedingRecords, cageCleanRecords } = useAnimal();
  const [activeTab, setActiveTab] = useState<TabType>('feeding');
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(() => {
    console.log('[FeedingPage] Page shown');
  });

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const handleRefresh = () => {
    setRefreshing(true);
    console.log('[FeedingPage] Pull to refresh');
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const todayFeeding = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return feedingRecords
      .filter(r => r.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [feedingRecords]);

  const todayClean = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return cageCleanRecords.filter(r => r.date === today);
  }, [cageCleanRecords]);

  const getAnimalName = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || '未知';
  };

  const getPeriodText = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10) return '早餐';
    if (hour < 14) return '午餐';
    if (hour < 18) return '下午';
    return '晚餐';
  };

  const getAppetiteText = (appetite: string) => {
    const map: Record<string, string> = {
      good: '良好',
      normal: '一般',
      poor: '不佳'
    };
    return map[appetite] || appetite;
  };

  const handleQuickAction = (path: string) => {
    console.log('[FeedingPage] Navigate to:', path);
    Taro.navigateTo({ url: path }).catch(err => {
      console.error('[FeedingPage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const handleAddFeeding = () => {
    Taro.showToast({ title: '添加投喂记录功能开发中', icon: 'none' });
  };

  const handleAddClean = () => {
    Taro.showToast({ title: '添加清洁记录功能开发中', icon: 'none' });
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
      <View className={styles.content}>
        <View className={styles.headerCard}>
          <Text className={styles.headerTitle}>饲养管理</Text>
          <Text className={styles.headerDesc}>今日待投喂 {todayFeeding.length} 次 · 待清洁 {todayClean.length} 个笼舍</Text>
        </View>

        <View className={styles.quickActions}>
          <View className={`${styles.quickCard} ${styles.quickCard1}`} onClick={() => handleQuickAction('/pages/feeding-manage/index')}>
            <View className={`${styles.quickIcon} ${styles.quickIcon1}`}>
              <Text>🍖</Text>
            </View>
            <View className={styles.quickInfo}>
              <Text className={styles.quickTitle}>投喂排班</Text>
              <Text className={styles.quickDesc}>制定投喂计划</Text>
            </View>
          </View>
          <View className={`${styles.quickCard} ${styles.quickCard2}`} onClick={() => handleQuickAction('/pages/feeding-manage/index')}>
            <View className={`${styles.quickIcon} ${styles.quickIcon2}`}>
              <Text>🧹</Text>
            </View>
            <View className={styles.quickInfo}>
              <Text className={styles.quickTitle}>笼舍清洁</Text>
              <Text className={styles.quickDesc}>清洁消毒记录</Text>
            </View>
          </View>
          <View className={`${styles.quickCard} ${styles.quickCard3}`} onClick={() => handleQuickAction('/pages/feeding-manage/index')}>
            <View className={`${styles.quickIcon} ${styles.quickIcon3}`}>
              <Text>📋</Text>
            </View>
            <View className={styles.quickInfo}>
              <Text className={styles.quickTitle}>饲养记录</Text>
              <Text className={styles.quickDesc}>查看历史记录</Text>
            </View>
          </View>
          <View className={`${styles.quickCard} ${styles.quickCard4}`} onClick={() => handleQuickAction('/pages/feeding-manage/index')}>
            <View className={`${styles.quickIcon} ${styles.quickIcon4}`}>
              <Text>🏠</Text>
            </View>
            <View className={styles.quickInfo}>
              <Text className={styles.quickTitle}>笼舍管理</Text>
              <Text className={styles.quickDesc}>笼舍分配维护</Text>
            </View>
          </View>
        </View>

        <View className={styles.tabs}>
          <View
            className={`${styles.tabItem} ${activeTab === 'feeding' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('feeding')}
          >
            <Text className={styles.tabText}>投喂记录</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'clean' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('clean')}
          >
            <Text className={styles.tabText}>清洁记录</Text>
          </View>
        </View>

        {activeTab === 'feeding' ? (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>今日投喂</Text>
              <View className={styles.moreBtn} onClick={handleAddFeeding}>
                <Text>+ 添加</Text>
              </View>
            </View>
            <View className={styles.feedingList}>
              {todayFeeding.length > 0 ? (
                todayFeeding.map((record: FeedingRecord) => (
                  <View key={record.id} className={styles.feedingItem}>
                    <View className={styles.feedingTime}>
                      <Text className={styles.feedingTimeText}>{record.time}</Text>
                      <Text className={styles.feedingPeriod}>{getPeriodText(record.time)}</Text>
                    </View>
                    <View className={styles.feedingContent}>
                      <Text className={styles.feedingAnimal}>{getAnimalName(record.animalId)}</Text>
                      <Text className={styles.feedingDetail}>{record.foodType} · {record.quantity}</Text>
                      <Text className={styles.feedingFeeder}>
                        饲养员: {record.feeder} · 食欲: {getAppetiteText(record.appetite)}
                      </Text>
                    </View>
                    <View className={styles.feedingStatus}>
                      <View className={styles.statusDone}>✓</View>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>🍽️</Text>
                  <Text className={styles.emptyText}>今日暂无投喂记录</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>今日清洁</Text>
              <View className={styles.moreBtn} onClick={handleAddClean}>
                <Text>+ 添加</Text>
              </View>
            </View>
            <View className={styles.cleanList}>
              {todayClean.length > 0 ? (
                todayClean.map((record: CageCleanRecord) => (
                  <View key={record.id} className={styles.cleanItem}>
                    <View className={styles.cleanCage}>
                      <Text className={styles.cleanCageText}>{record.cageNumber}</Text>
                    </View>
                    <View className={styles.cleanInfo}>
                      <Text className={styles.cleanAnimal}>
                        {record.animalId ? getAnimalName(record.animalId) : '空笼舍'}
                      </Text>
                      <View className={styles.cleanMeta}>
                        <Text className={styles.cleanMetaItem}>
                          <Text className={styles.cleanIcon}>👤</Text>
                          {record.cleaner}
                        </Text>
                        <Text className={`${styles.cleanBadge} ${record.disinfection ? styles.badgeDisinfected : styles.badgeNormal}`}>
                          {record.disinfection ? '已消毒' : '常规清洁'}
                        </Text>
                      </View>
                    </View>
                    <View className={styles.feedingStatus}>
                      <View className={styles.statusDone}>✓</View>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>🧹</Text>
                  <Text className={styles.emptyText}>今日暂无清洁记录</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default FeedingPage;
