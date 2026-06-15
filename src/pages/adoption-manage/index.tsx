import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const AdoptionManagePage: React.FC = () => {
  useDidShow(() => {
    console.log('[AdoptionManagePage] Page shown');
  });

  const features = [
    { icon: '🐾', text: '可领养动物展示' },
    { icon: '📋', text: '领养申请审核' },
    { icon: '👤', text: '领养人资质评估' },
    { icon: '📝', text: '领养协议管理' },
    { icon: '📞', text: '领养后回访' },
    { icon: '🏠', text: '送养家庭匹配' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>领养送养管理</Text>
        <Text className={styles.subtitle}>管理可领养动物和领养申请审核流程</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>🏡</Text>
          <Text className={styles.placeholderTitle}>领养送养管理功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持可领养动物展示、领养申请审核、领养人资质评估、送养家庭匹配等功能。
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

export default AdoptionManagePage;
