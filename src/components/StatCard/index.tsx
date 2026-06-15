import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'primary' }) => {
  return (
    <View className={classnames(styles.statCard, styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`])}>
      <Text className={styles.statValue}>{value}</Text>
      <Text className={styles.statTitle}>{title}</Text>
    </View>
  );
};

export default StatCard;
