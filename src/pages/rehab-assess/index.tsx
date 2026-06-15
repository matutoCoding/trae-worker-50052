import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const RehabAssessPage: React.FC = () => {
  useDidShow(() => {
    console.log('[RehabAssessPage] Page shown');
  });

  const features = [
    { icon: '💪', text: '康复训练计划' },
    { icon: '🏃', text: '运动能力评估' },
    { icon: '🦅', text: '野化训练记录' },
    { icon: '📈', text: '康复进度跟踪' },
    { icon: '✅', text: '放归前评估' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>康复评估</Text>
        <Text className={styles.subtitle}>跟踪动物康复过程和野化训练</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>💪</Text>
          <Text className={styles.placeholderTitle}>康复评估功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持康复训练记录、野化训练管理、放归前综合评估等功能。
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

export default RehabAssessPage;
