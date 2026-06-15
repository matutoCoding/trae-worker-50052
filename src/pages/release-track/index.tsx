import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const ReleaseTrackPage: React.FC = () => {
  useDidShow(() => {
    console.log('[ReleaseTrackPage] Page shown');
  });

  const features = [
    { icon: '📍', text: '放归地点选择' },
    { icon: '🗺️', text: '放归路线规划' },
    { icon: '🐾', text: '放归后追踪记录' },
    { icon: '📊', text: '生存状态监测' },
    { icon: '📝', text: '放归报告生成' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>放归跟踪</Text>
        <Text className={styles.subtitle}>记录动物放归过程和后续追踪</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>🌲</Text>
          <Text className={styles.placeholderTitle}>放归跟踪功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持放归地点选择、放归过程记录、放归后追踪监测等功能。
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

export default ReleaseTrackPage;
