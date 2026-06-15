import React from 'react';
import { View, Text } from '@tarojs/components';
import { AnimalStatus } from '../../types/animal';
import { getStatusText, getStatusTagClass } from '../../utils';
import styles from './index.module.scss';

interface StatusBadgeProps {
  status: AnimalStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const tagClass = getStatusTagClass(status);
  const statusText = getStatusText(status);

  return (
    <View className={`${styles.badge} ${styles[tagClass]}`}>
      <Text className={styles.badgeText}>{statusText}</Text>
    </View>
  );
};

export default StatusBadge;
