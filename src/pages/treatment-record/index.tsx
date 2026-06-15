import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';

const TreatmentRecordPage: React.FC = () => {
  useDidShow(() => {
    console.log('[TreatmentRecordPage] Page shown');
  });

  const features = [
    { icon: '📝', text: '诊疗记录管理' },
    { icon: '💊', text: '用药方案记录' },
    { icon: '🔬', text: '检查检验结果' },
    { icon: '📅', text: '复诊提醒设置' },
    { icon: '👨‍⚕️', text: '医生签名确认' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>治疗记录</Text>
        <Text className={styles.subtitle}>记录动物的诊疗过程和用药情况</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.placeholderContainer}>
          <Text className={styles.placeholderIcon}>💊</Text>
          <Text className={styles.placeholderTitle}>治疗记录功能</Text>
          <Text className={styles.placeholderDesc}>
            该功能正在开发中，敬请期待。完成后将支持完整的诊疗记录管理、用药方案跟踪、复诊提醒等功能。
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

export default TreatmentRecordPage;
