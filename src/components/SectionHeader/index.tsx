import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showMore?: boolean;
  moreText?: string;
  onMoreClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  showMore = false,
  moreText = '查看更多',
  onMoreClick
}) => {
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
    } else {
      Taro.showToast({ title: '更多功能开发中', icon: 'none' });
    }
  };

  return (
    <View className={styles.sectionHeader}>
      <View className={styles.headerLeft}>
        <View className={styles.titleLine}></View>
        <Text className={styles.title}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showMore && (
        <View className={styles.moreBtn} onClick={handleMoreClick}>
          <Text className={styles.moreText}>{moreText}</Text>
          <Text className={styles.moreArrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
