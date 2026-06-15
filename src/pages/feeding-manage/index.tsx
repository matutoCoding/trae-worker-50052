import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const FeedingManagePage: React.FC = () => {
  useDidShow(() => {
    console.log('[FeedingManagePage] Page shown');
  });

  const features = [
    { icon: '📅', text: '投喂计划排班' },
    { icon: '🍖', text: '饲料配方管理' },
    { icon: '🏠', text: '笼舍分配调整' },
    { icon: '🧹', text: '清洁消毒记录' },
    { icon: '📊', text: '饲养数据统计' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>饲养管理</Text>
        <Text className={styles.subtitle}>管理动物的日常饲养和笼舍清洁</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>🍖</Text>
          <Text className={styles.placeholderTitle}>饲养管理功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持投喂排班、笼舍分配、清洁记录等完整的饲养管理功能。
          </Text>

          <View className={styles.featureList}>
            {features.map((feature, index) => (
              <View key={index} className={styles.featureItem}>
                <Text className={styles.featureIcon}>{feature.icon}</Text>
                <Text className={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          <Text className={styles.comingSoonBadge}>即将上线</Text>
        </View>
      </View>
    </View>
  );
};

export default FeedingManagePage;
