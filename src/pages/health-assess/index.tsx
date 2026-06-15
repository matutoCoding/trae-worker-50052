import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const HealthAssessPage: React.FC = () => {
  useDidShow(() => {
    console.log('[HealthAssessPage] Page shown');
  });

  const features = [
    { icon: '🩺', text: '伤情评估与分级' },
    { icon: '🦠', text: '传染病筛查' },
    { icon: '📋', text: '隔离观察安排' },
    { icon: '📊', text: '健康等级评定' },
    { icon: '💉', text: '疫苗接种记录' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>健康评估</Text>
        <Text className={styles.subtitle}>对新接收动物进行全面健康检查</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>🏥</Text>
          <Text className={styles.placeholderTitle}>健康评估功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持动物伤情评估、传染病筛查、隔离观察安排等功能。
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

export default HealthAssessPage;
