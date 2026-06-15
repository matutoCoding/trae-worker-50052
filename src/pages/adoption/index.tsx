import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, Image } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import StatCard from '../../components/StatCard';
import { AdoptionApplication, ReleaseRecord } from '../../types/animal';
import styles from './index.module.scss';

type TabType = 'adoptable' | 'release' | 'application';

const AdoptionPage: React.FC = () => {
  const { animals, releaseRecords, adoptionApplications } = useAnimal();
  const [activeTab, setActiveTab] = useState<TabType>('adoptable');
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(() => {
    console.log('[AdoptionPage] Page shown');
  });

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const handleRefresh = () => {
    setRefreshing(true);
    console.log('[AdoptionPage] Pull to refresh');
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const adoptableAnimals = useMemo(() => {
    return animals.filter(a => a.adoptable && a.status !== 'adopted');
  }, [animals]);

  const recentReleases = useMemo(() => {
    return [...releaseRecords]
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
      .slice(0, 4);
  }, [releaseRecords]);

  const pendingApplications = useMemo(() => {
    return adoptionApplications
      .filter(a => a.status === 'pending')
      .sort((a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime());
  }, [adoptionApplications]);

  const getAnimalName = (animalId: string) => {
    return animals.find(a => a.id === animalId)?.name || '未知';
  };

  const getAnimalAvatar = (animalId: string) => {
    return animals.find(a => a.id === animalId)?.avatar || '';
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      completed: '已完成'
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      rejected: styles.statusRejected,
      completed: styles.statusCompleted
    };
    return map[status] || '';
  };

  const handleAdoptableClick = (animalId: string) => {
    Taro.navigateTo({ url: `/pages/health-assess/index?animalId=${animalId}` });
  };

  const handleReleaseClick = (recordId: string) => {
    console.log('[AdoptionPage] Click release record:', recordId);
    Taro.navigateTo({ url: '/pages/release-track/index' }).catch(err => {
      console.error('[AdoptionPage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const handleApplicationClick = (appId: string) => {
    console.log('[AdoptionPage] Click application:', appId);
    Taro.navigateTo({ url: '/pages/adoption-manage/index' }).catch(err => {
      console.error('[AdoptionPage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const handleQuickAction = (path: string) => {
    console.log('[AdoptionPage] Navigate to:', path);
    Taro.navigateTo({ url: path }).catch(err => {
      console.error('[AdoptionPage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const stats = useMemo(() => ({
    adoptable: animals.filter(a => a.adoptable && a.status !== 'adopted').length,
    released: releaseRecords.length,
    adopted: animals.filter(a => a.status === 'adopted').length,
    pending: adoptionApplications.filter(a => a.status === 'pending').length
  }), [animals, releaseRecords, adoptionApplications]);

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
        <View className={styles.statsRow}>
          <StatCard title='可领养' value={stats.adoptable} color='accent' />
          <StatCard title='已放归' value={stats.released} color='info' />
          <StatCard title='已领养' value={stats.adopted} color='success' />
          <StatCard title='待审核' value={stats.pending} color='warning' />
        </View>

        <View className={styles.tabs}>
          <View
            className={`${styles.tabItem} ${activeTab === 'adoptable' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('adoptable')}
          >
            <Text className={styles.tabText}>可领养动物</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'release' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('release')}
          >
            <Text className={styles.tabText}>放归记录</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'application' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('application')}
          >
            <Text className={styles.tabText}>领养申请</Text>
          </View>
        </View>

        {activeTab === 'adoptable' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>可领养动物</Text>
              <View className={styles.moreBtn} onClick={() => handleQuickAction('/pages/adoption-manage/index')}>
                <Text>管理</Text>
                <Text>›</Text>
              </View>
            </View>
            {adoptableAnimals.length > 0 ? (
              <View className={styles.adoptableGrid}>
                {adoptableAnimals.map(animal => (
                  <View
                    key={animal.id}
                    className={styles.adoptableCard}
                    onClick={() => handleAdoptableClick(animal.id)}
                  >
                    <Image
                      className={styles.adoptableImage}
                      src={animal.avatar}
                      mode='aspectFill'
                      lazyLoad
                      onError={(e) => console.error('[AdoptionPage] Image load error:', e.detail)}
                    />
                    <View className={styles.adoptableInfo}>
                      <Text className={styles.adoptableName}>{animal.name}</Text>
                      <Text className={styles.adoptableSpecies}>{animal.species} · {animal.age}</Text>
                      <View className={styles.adoptableTags}>
                        <Text className={styles.adoptableTag}>{animal.breed}</Text>
                        <Text className={styles.adoptableTag}>健康{animal.healthLevel}级</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🏠</Text>
                <Text className={styles.emptyText}>暂无可领养动物</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'release' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>最近放归</Text>
              <View className={styles.moreBtn} onClick={() => handleQuickAction('/pages/release-track/index')}>
                <Text>全部</Text>
                <Text>›</Text>
              </View>
            </View>
            <View className={styles.releaseList}>
              {recentReleases.length > 0 ? (
                recentReleases.map((record: ReleaseRecord) => (
                  <View
                    key={record.id}
                    className={styles.releaseItem}
                    onClick={() => handleReleaseClick(record.id)}
                  >
                    <Image
                      className={styles.releaseAvatar}
                      src={getAnimalAvatar(record.animalId)}
                      mode='aspectFill'
                      lazyLoad
                      onError={(e) => console.error('[AdoptionPage] Image load error:', e.detail)}
                    />
                    <View className={styles.releaseInfo}>
                      <Text className={styles.releaseName}>{getAnimalName(record.animalId)}</Text>
                      <Text className={styles.releaseLocation}>📍 {record.releaseLocation}</Text>
                      <View className={styles.releaseDate}>
                        <Text>📅 {record.releaseDate}</Text>
                        <Text className={styles.trackCount}>
                          追踪 {record.trackRecords.length} 次
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>🌲</Text>
                  <Text className={styles.emptyText}>暂无放归记录</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === 'application' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>待审核申请</Text>
              <View className={styles.moreBtn} onClick={() => handleQuickAction('/pages/adoption-manage/index')}>
                <Text>全部</Text>
                <Text>›</Text>
              </View>
            </View>
            <View className={styles.applicationList}>
              {pendingApplications.length > 0 ? (
                pendingApplications.map((app: AdoptionApplication) => (
                  <View
                    key={app.id}
                    className={styles.applicationItem}
                    onClick={() => handleApplicationClick(app.id)}
                  >
                    <View className={styles.applicationHeader}>
                      <Text className={styles.applicationAnimal}>
                      {getAnimalName(app.animalId)}
                      </Text>
                      <Text className={`${styles.applicationStatus} ${getStatusClass(app.status)}`}>
                        {getStatusText(app.status)}
                      </Text>
                    </View>
                    <Text className={styles.applicationInfo}>
                      申请人: {app.applicantName} · {app.applicantPhone}
                    </Text>
                    <Text className={styles.applicationInfo}>
                      {app.reason.length > 30 ? app.reason.substring(0, 30) + '...' : app.reason}
                    </Text>
                    <Text className={styles.applicationDate}>
                      申请时间: {app.applyDate}
                    </Text>
                  </View>
                ))
              ) : (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyIcon}>📋</Text>
                  <Text className={styles.emptyText}>暂无待审核申请</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AdoptionPage;
