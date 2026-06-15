import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { AnimalSource, HealthLevel } from '../../types/animal';
import { generateId, formatDate } from '../../utils';
import styles from './index.module.scss';

const ReceptionPage: React.FC = () => {
  const { addAnimal } = useAnimal();

  useDidShow(() => {
    console.log('[ReceptionPage] Page shown');
  });

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    weight: '',
    source: 'rescue' as AnimalSource,
    sourceDetail: '',
    injuryDescription: '',
    description: '',
    healthLevel: 'B' as HealthLevel,
    cageNumber: '',
  });

  const [isQuarantine, setIsQuarantine] = useState(false);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'unknown') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleSourceSelect = (source: AnimalSource) => {
    setFormData(prev => ({ ...prev, source }));
  };

  const handleHealthSelect = (level: HealthLevel) => {
    setFormData(prev => ({ ...prev, healthLevel: level }));
  };

  const handleUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then((res) => {
      const tempFilePath = res.tempFilePaths[0];
      Taro.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (fileRes) => {
          const base64 = `data:image/jpeg;base64,${fileRes.data as string}`;
          setAvatarImages(prev => [...prev, base64]);
        }
      });
    });
  };

  const handleSubmit = () => {
    console.log('[ReceptionPage] Submit form:', formData);

    if (!formData.name || !formData.species) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    const newAnimal = {
      id: generateId(),
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      status: isQuarantine ? 'quarantine' : 'treating' as const,
      receiveDate: formatDate(new Date()),
      avatar: avatarImages.length > 0 ? avatarImages[0] : `https://picsum.photos/id/${200 + Math.floor(Math.random() * 100)}/300/300`,
      isQuarantine,
      quarantineEndDate: isQuarantine ? formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) : undefined,
      treatmentPlan: '',
      feedingSchedule: '',
      adoptable: false,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };

    addAnimal(newAnimal);
    console.log('[ReceptionPage] Animal added:', newAnimal);
    Taro.showToast({ title: '登记成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const genderOptions = [
    { key: 'male', label: '雄性' },
    { key: 'female', label: '雌性' },
    { key: 'unknown', label: '未知' }
  ];

  const sourceOptions = [
    { key: 'rescue', label: '野外救助' },
    { key: 'donation', label: '群众捐赠' },
    { key: 'transfer', label: '机构转来' },
    { key: 'other', label: '其他来源' }
  ];

  const healthOptions = [
    { key: 'A', label: 'A级（健康）' },
    { key: 'B', label: 'B级（轻伤）' },
    { key: 'C', label: 'C级（重伤）' },
    { key: 'D', label: 'D级（危重）' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>接收登记</Text>
        <Text className={styles.subtitle}>录入新救助动物的基础信息</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>动物名称
            </Text>
            <Input
              className={styles.input}
              placeholder='请输入动物名称'
              value={formData.name}
              onInput={(e) => handleInputChange('name', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>物种
            </Text>
            <Input
              className={styles.input}
              placeholder='如：狐狸、大雁、猴子等'
              value={formData.species}
              onInput={(e) => handleInputChange('species', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>品种</Text>
            <Input
              className={styles.input}
              placeholder='如：赤狐、鸿雁、猕猴等'
              value={formData.breed}
              onInput={(e) => handleInputChange('breed', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>年龄</Text>
            <Input
              className={styles.input}
              placeholder='如：2岁、6个月等'
              value={formData.age}
              onInput={(e) => handleInputChange('age', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>性别</Text>
            <View className={styles.selectRow}>
              {genderOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${formData.gender === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => handleGenderSelect(option.key as 'male' | 'female' | 'unknown')}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>体重 (kg)</Text>
            <Input
              className={styles.input}
              type='digit'
              placeholder='请输入体重'
              value={formData.weight}
              onInput={(e) => handleInputChange('weight', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>笼舍编号</Text>
            <Input
              className={styles.input}
              placeholder='如：A-01'
              value={formData.cageNumber}
              onInput={(e) => handleInputChange('cageNumber', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>来源信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>来源类型
            </Text>
            <View className={styles.selectRow}>
              {sourceOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${formData.source === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => handleSourceSelect(option.key as AnimalSource)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>来源详情</Text>
            <Textarea
              className={styles.textarea}
              placeholder='请详细描述动物的发现地点、受伤原因等信息'
              value={formData.sourceDetail}
              onInput={(e) => handleInputChange('sourceDetail', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>健康评估</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>健康等级
            </Text>
            <View className={styles.selectRow}>
              {healthOptions.map(option => (
                <View
                  key={option.key}
                  className={`${styles.selectItem} ${formData.healthLevel === option.key ? styles.selectItemActive : ''}`}
                  onClick={() => handleHealthSelect(option.key as HealthLevel)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>伤情描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder='请详细描述动物的伤情，包括受伤部位、程度等'
              value={formData.injuryDescription}
              onInput={(e) => handleInputChange('injuryDescription', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注信息</Text>
            <Textarea
              className={styles.textarea}
              placeholder='其他需要备注的信息'
              value={formData.description}
              onInput={(e) => handleInputChange('description', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>是否需要隔离观察</Text>
            <View className={styles.selectRow}>
              <View
                className={`${styles.selectItem} ${isQuarantine ? styles.selectItemActive : ''}`}
                onClick={() => setIsQuarantine(true)}
              >
                <Text>是</Text>
              </View>
              <View
                className={`${styles.selectItem} ${!isQuarantine ? styles.selectItemActive : ''}`}
                onClick={() => setIsQuarantine(false)}
              >
                <Text>否</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>照片资料</Text>
          <View className={styles.uploadArea} onClick={handleUpload}>
            <Text className={styles.uploadIcon}>📷</Text>
            <Text className={styles.uploadText}>点击上传动物照片</Text>
          </View>
          {avatarImages.length > 0 && (
            <View className={styles.previewContainer}>
              {avatarImages.map((img, index) => (
                <Image key={index} className={styles.previewImage} src={img} mode='aspectFill' />
              ))}
            </View>
          )}
        </View>

        <Button className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>提交登记</Text>
        </Button>
      </View>
    </View>
  );
};

export default ReceptionPage;
