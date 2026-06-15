import React, { useState } from 'react';
import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { generateId } from '../../utils';
import styles from './index.module.scss';

const ReleaseTrackPage: React.FC = () => {
  const {
    animals,
    releaseRecords,
    addReleaseRecord,
    addTrackRecord,
    updateAnimal,
    getAnimalById,
  } = useAnimal();

  useDidShow(() => {
    console.log('[ReleaseTrackPage] Page shown');
  });

  const recoveredAnimals = animals.filter(a => a.status === 'recovered');

  const [releaseForm, setReleaseForm] = useState({
    animalId: '',
    releaseDate: '',
    releaseLocation: '',
    coordinates: '',
    environment: '',
    weather: '',
    recorder: '',
    notes: '',
  });

  const [selectedReleaseId, setSelectedReleaseId] = useState('');
  const [trackForm, setTrackForm] = useState({
    date: '',
    location: '',
    coordinates: '',
    healthStatus: '',
    behavior: '',
    recorder: '',
    notes: '',
  });

  const [animalPickerIndex, setAnimalPickerIndex] = useState(-1);
  const [releasePickerIndex, setReleasePickerIndex] = useState(-1);

  const handleReleaseInput = (field: string, value: string) => {
    setReleaseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTrackInput = (field: string, value: string) => {
    setTrackForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAnimalPick = (e) => {
    const idx = Number(e.detail.value);
    setAnimalPickerIndex(idx);
    if (idx >= 0 && idx < recoveredAnimals.length) {
      setReleaseForm(prev => ({ ...prev, animalId: recoveredAnimals[idx].id }));
    }
  };

  const handleReleasePick = (e) => {
    const idx = Number(e.detail.value);
    setReleasePickerIndex(idx);
    if (idx >= 0 && idx < releaseRecords.length) {
      setSelectedReleaseId(releaseRecords[idx].id);
    }
  };

  const handleSubmitRelease = () => {
    if (!releaseForm.animalId) {
      Taro.showToast({ title: '请选择动物', icon: 'none' });
      return;
    }
    if (!releaseForm.releaseDate || !releaseForm.releaseLocation) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    const record = {
      id: generateId(),
      animalId: releaseForm.animalId,
      releaseDate: releaseForm.releaseDate,
      releaseLocation: releaseForm.releaseLocation,
      coordinates: releaseForm.coordinates,
      environment: releaseForm.environment,
      weather: releaseForm.weather,
      recorder: releaseForm.recorder,
      notes: releaseForm.notes || undefined,
      trackRecords: [],
    };

    addReleaseRecord(record);
    updateAnimal(releaseForm.animalId, {
      status: 'released',
      releaseDate: releaseForm.releaseDate,
      releaseLocation: releaseForm.releaseLocation,
    });

    Taro.showToast({ title: '放归记录已保存', icon: 'success' });

    setReleaseForm({
      animalId: '',
      releaseDate: '',
      releaseLocation: '',
      coordinates: '',
      environment: '',
      weather: '',
      recorder: '',
      notes: '',
    });
    setAnimalPickerIndex(-1);
  };

  const handleSubmitTrack = () => {
    if (!selectedReleaseId) {
      Taro.showToast({ title: '请选择放归记录', icon: 'none' });
      return;
    }
    if (!trackForm.date || !trackForm.location) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    const track = {
      id: generateId(),
      date: trackForm.date,
      location: trackForm.location,
      coordinates: trackForm.coordinates,
      healthStatus: trackForm.healthStatus,
      behavior: trackForm.behavior,
      recorder: trackForm.recorder,
      notes: trackForm.notes || undefined,
    };

    addTrackRecord(selectedReleaseId, track);
    Taro.showToast({ title: '追踪记录已添加', icon: 'success' });

    setTrackForm({
      date: '',
      location: '',
      coordinates: '',
      healthStatus: '',
      behavior: '',
      recorder: '',
      notes: '',
    });
    setReleasePickerIndex(-1);
    setSelectedReleaseId('');
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>放归跟踪</Text>
        <Text className={styles.subtitle}>记录动物放归过程和后续追踪</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>创建放归记录</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择动物
            </Text>
            <Picker mode="selector" range={recoveredAnimals.map(a => a.name)} onChange={handleAnimalPick}>
              <View className={styles.pickerInput}>
                <Text className={animalPickerIndex >= 0 ? styles.pickerText : styles.pickerPlaceholder}>
                  {animalPickerIndex >= 0 && animalPickerIndex < recoveredAnimals.length
                    ? recoveredAnimals[animalPickerIndex].name
                    : '请选择已康复动物'}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>放归日期
            </Text>
            <Input
              className={styles.input}
              type="text"
              placeholder="请输入放归日期"
              value={releaseForm.releaseDate}
              onInput={(e) => handleReleaseInput('releaseDate', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>放归地点
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入放归地点"
              value={releaseForm.releaseLocation}
              onInput={(e) => handleReleaseInput('releaseLocation', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>坐标</Text>
            <Input
              className={styles.input}
              placeholder="如：39.9042,116.4074"
              value={releaseForm.coordinates}
              onInput={(e) => handleReleaseInput('coordinates', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>环境描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请描述放归地环境"
              value={releaseForm.environment}
              onInput={(e) => handleReleaseInput('environment', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>天气</Text>
            <Input
              className={styles.input}
              placeholder="如：晴、多云"
              value={releaseForm.weather}
              onInput={(e) => handleReleaseInput('weather', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>记录人</Text>
            <Input
              className={styles.input}
              placeholder="请输入记录人"
              value={releaseForm.recorder}
              onInput={(e) => handleReleaseInput('recorder', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Textarea
              className={styles.textarea}
              placeholder="其他备注信息"
              value={releaseForm.notes}
              onInput={(e) => handleReleaseInput('notes', e.detail.value)}
            />
          </View>

          <Button className={styles.submitBtn} onClick={handleSubmitRelease}>
            <Text className={styles.submitBtnText}>保存放归记录</Text>
          </Button>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>追踪记录追加</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择放归记录
            </Text>
            <Picker mode="selector" range={releaseRecords.map(r => {
              const a = getAnimalById(r.animalId);
              return a ? `${a.name} - ${r.releaseDate}` : r.releaseDate;
            })} onChange={handleReleasePick}>
              <View className={styles.pickerInput}>
                <Text className={releasePickerIndex >= 0 ? styles.pickerText : styles.pickerPlaceholder}>
                  {releasePickerIndex >= 0 && releasePickerIndex < releaseRecords.length
                    ? (() => {
                        const r = releaseRecords[releasePickerIndex];
                        const a = getAnimalById(r.animalId);
                        return a ? `${a.name} - ${r.releaseDate}` : r.releaseDate;
                      })()
                    : '请选择放归记录'}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>追踪日期
            </Text>
            <Input
              className={styles.input}
              type="text"
              placeholder="请输入追踪日期"
              value={trackForm.date}
              onInput={(e) => handleTrackInput('date', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>位置
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入位置"
              value={trackForm.location}
              onInput={(e) => handleTrackInput('location', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>坐标</Text>
            <Input
              className={styles.input}
              placeholder="如：39.9042,116.4074"
              value={trackForm.coordinates}
              onInput={(e) => handleTrackInput('coordinates', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>健康状态</Text>
            <Input
              className={styles.input}
              placeholder="如：良好、一般"
              value={trackForm.healthStatus}
              onInput={(e) => handleTrackInput('healthStatus', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>行为描述</Text>
            <Input
              className={styles.input}
              placeholder="请输入行为描述"
              value={trackForm.behavior}
              onInput={(e) => handleTrackInput('behavior', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>记录人</Text>
            <Input
              className={styles.input}
              placeholder="请输入记录人"
              value={trackForm.recorder}
              onInput={(e) => handleTrackInput('recorder', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Textarea
              className={styles.textarea}
              placeholder="其他备注信息"
              value={trackForm.notes}
              onInput={(e) => handleTrackInput('notes', e.detail.value)}
            />
          </View>

          <Button className={styles.submitBtn} onClick={handleSubmitTrack}>
            <Text className={styles.submitBtnText}>保存追踪记录</Text>
          </Button>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>放归记录列表</Text>

          {releaseRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyText}>暂无放归记录</Text>
            </View>
          ) : (
            <View className={styles.releaseList}>
              {releaseRecords.map(record => {
                const animal = getAnimalById(record.animalId);
                return (
                  <View key={record.id} className={styles.releaseItem}>
                    <View className={styles.releaseItemHeader}>
                      <Text className={styles.animalName}>
                        {animal ? animal.name : '未知动物'}
                      </Text>
                      <Text className={styles.trackCount}>
                        追踪 {record.trackRecords.length} 次
                      </Text>
                    </View>
                    <View className={styles.releaseItemInfo}>
                      <Text className={styles.releaseInfoText}>放归日期：{record.releaseDate}</Text>
                      <Text className={styles.releaseInfoText}>放归地点：{record.releaseLocation}</Text>
                    </View>
                    {record.trackRecords.length > 0 && (
                      <View className={styles.trackSection}>
                        <Text className={styles.trackSectionTitle}>追踪记录</Text>
                        {record.trackRecords.map(track => (
                          <View key={track.id} className={styles.trackItem}>
                            <View className={styles.trackItemHeader}>
                              <Text className={styles.trackDate}>{track.date}</Text>
                              {track.healthStatus && (
                                <Text className={styles.trackHealth}>{track.healthStatus}</Text>
                              )}
                            </View>
                            <Text className={styles.trackLocation}>位置：{track.location}</Text>
                            {track.behavior && (
                              <Text className={styles.trackBehavior}>行为：{track.behavior}</Text>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ReleaseTrackPage;
