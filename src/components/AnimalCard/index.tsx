import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Animal } from '../../types/animal';
import StatusBadge from '../StatusBadge';
import { getDaysInShelter, getSourceText } from '../../utils';
import styles from './index.module.scss';

interface AnimalCardProps {
  animal: Animal;
  onClick?: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick }) => {
  const daysInShelter = getDaysInShelter(animal.receiveDate);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({ url: `/pages/health-assess/index?animalId=${animal.id}` });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.cardInner}>
        <Image
          className={styles.avatar}
          src={animal.avatar}
          mode='aspectFill'
          lazyLoad={animal.avatar?.startsWith('data:') ? false : true}
          onError={(e) => console.error('[AnimalCard] Image load error:', e.detail)}
        />
        <View className={styles.info}>
          <View className={styles.headerRow}>
            <Text className={styles.name}>{animal.name}</Text>
            <StatusBadge status={animal.status} />
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detail}>{animal.species} · {animal.breed}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detail}>{getSourceText(animal.source)}</Text>
            <Text className={styles.separator}>·</Text>
            <Text className={styles.detail}>入站{daysInShelter}天</Text>
          </View>
          <View className={styles.footerRow}>
            <View className={styles.cageTag}>
              <Text className={styles.cageText}>{animal.cageNumber}</Text>
            </View>
            <Text className={styles.healthLevel}>健康等级: {animal.healthLevel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AnimalCard;
