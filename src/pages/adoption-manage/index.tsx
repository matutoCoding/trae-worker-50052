import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import { generateId, formatDate } from '../../utils';
import styles from './index.module.scss';

type TabType = 'list' | 'add';

const STATUS_MAP: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  completed: '已完成',
};

const AdoptionManagePage: React.FC = () => {
  const {
    animals,
    adoptionApplications,
    updateAdoptionApplication,
    addAdoptionApplication,
    updateAnimal,
  } = useAnimal();

  const [activeTab, setActiveTab] = useState<TabType>('list');

  const [formData, setFormData] = useState({
    animalId: '',
    applicantName: '',
    applicantPhone: '',
    applicantAddress: '',
    experience: '',
    reason: '',
  });
  const [animalPickerIndex, setAnimalPickerIndex] = useState(0);

  const sortedApplications = useMemo(() => {
    return [...adoptionApplications].sort(
      (a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime()
    );
  }, [adoptionApplications]);

  const adoptableAnimals = useMemo(() => {
    return animals.filter((a) => a.adoptable && a.status !== 'adopted');
  }, [animals]);

  const animalPickerRange = useMemo(() => {
    return adoptableAnimals.map((a) => a.name);
  }, [adoptableAnimals]);

  const getAnimalName = (animalId: string) => {
    return animals.find((a) => a.id === animalId)?.name || '未知';
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      rejected: styles.statusRejected,
      completed: styles.statusCompleted,
    };
    return map[status] || '';
  };

  const handleApprove = (id: string, animalId: string) => {
    const today = formatDate(new Date());
    updateAdoptionApplication(id, {
      status: 'approved',
      reviewDate: today,
      reviewer: '当前管理员',
      reviewNotes: '审核通过',
    });

    const animal = animals.find((a) => a.id === animalId);
    if (animal && animal.adoptable && animal.status !== 'adopted') {
      updateAnimal(animalId, { status: 'adopted' });
    }

    Taro.showToast({ title: '已通过', icon: 'success' });
  };

  const handleReject = (id: string) => {
    Taro.showModal({
      title: '拒绝原因',
      editable: true,
      placeholderText: '请输入拒绝原因',
      success: (res) => {
        if (res.confirm) {
          const reason = res.content || '未填写原因';
          const today = formatDate(new Date());
          updateAdoptionApplication(id, {
            status: 'rejected',
            reviewDate: today,
            reviewer: '当前管理员',
            reviewNotes: reason,
          });
          Taro.showToast({ title: '已拒绝', icon: 'success' });
        }
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnimalPick = (e: { detail: { value: number } }) => {
    const idx = e.detail.value;
    setAnimalPickerIndex(idx);
    if (adoptableAnimals[idx]) {
      setFormData((prev) => ({ ...prev, animalId: adoptableAnimals[idx].id }));
    }
  };

  const handleSubmit = () => {
    if (!formData.animalId) {
      Taro.showToast({ title: '请选择领养动物', icon: 'none' });
      return;
    }
    if (!formData.applicantName) {
      Taro.showToast({ title: '请填写申请人姓名', icon: 'none' });
      return;
    }
    if (!formData.applicantPhone) {
      Taro.showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }
    if (!formData.reason) {
      Taro.showToast({ title: '请填写申请原因', icon: 'none' });
      return;
    }

    addAdoptionApplication({
      id: generateId(),
      animalId: formData.animalId,
      applicantName: formData.applicantName,
      applicantPhone: formData.applicantPhone,
      applicantAddress: formData.applicantAddress,
      experience: formData.experience,
      reason: formData.reason,
      status: 'pending',
      applyDate: formatDate(new Date()),
    });

    Taro.showToast({ title: '申请已提交', icon: 'success' });
    setFormData({
      animalId: '',
      applicantName: '',
      applicantPhone: '',
      applicantAddress: '',
      experience: '',
      reason: '',
    });
    setAnimalPickerIndex(0);
    setActiveTab('list');
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>领养送养管理</Text>
        <Text className={styles.subtitle}>管理可领养动物和领养申请审核流程</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.tabs}>
          <View
            className={`${styles.tabItem} ${activeTab === 'list' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Text className={styles.tabText}>领养申请</Text>
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'add' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <Text className={styles.tabText}>新增申请</Text>
          </View>
        </View>

        {activeTab === 'list' && (
          <View className={styles.applicationList}>
            {sortedApplications.length > 0 ? (
              sortedApplications.map((app) => (
                <View key={app.id} className={styles.applicationItem}>
                  <View className={styles.applicationHeader}>
                    <Text className={styles.applicantName}>{app.applicantName}</Text>
                    <Text className={`${styles.statusTag} ${getStatusClass(app.status)}`}>
                      {STATUS_MAP[app.status]}
                    </Text>
                  </View>
                  <View className={styles.applicationBody}>
                    <Text className={styles.applicationInfo}>电话：{app.applicantPhone}</Text>
                    <Text className={styles.applicationInfo}>申请动物：{getAnimalName(app.animalId)}</Text>
                    <Text className={styles.applicationInfo}>
                      申请原因：{app.reason.length > 40 ? app.reason.substring(0, 40) + '…' : app.reason}
                    </Text>
                    <Text className={styles.applicationDate}>申请时间：{app.applyDate}</Text>
                    {app.reviewDate && (
                      <Text className={styles.applicationDate}>
                        审核时间：{app.reviewDate} · {app.reviewer}
                      </Text>
                    )}
                    {app.reviewNotes && app.status !== 'approved' && (
                      <Text className={styles.applicationNotes}>审核备注：{app.reviewNotes}</Text>
                    )}
                  </View>
                  {app.status === 'pending' && (
                    <View className={styles.actionRow}>
                      <View className={styles.approveBtn} onClick={() => handleApprove(app.id, app.animalId)}>
                        <Text className={styles.actionBtnText}>通过</Text>
                      </View>
                      <View className={styles.rejectBtn} onClick={() => handleReject(app.id)}>
                        <Text className={styles.actionBtnText}>拒绝</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📋</Text>
                <Text className={styles.emptyText}>暂无领养申请</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'add' && (
          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>新增领养申请</Text>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>选择可领养动物
              </Text>
              {adoptableAnimals.length > 0 ? (
                <Picker mode="selector" range={animalPickerRange} value={animalPickerIndex} onChange={handleAnimalPick}>
                  <View className={styles.pickerValue}>
                    <Text className={styles.pickerText}>
                      {animalPickerRange[animalPickerIndex] || '请选择动物'}
                    </Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              ) : (
                <View className={styles.pickerValue}>
                  <Text className={styles.pickerPlaceholder}>暂无可领养动物</Text>
                </View>
              )}
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>申请人姓名
              </Text>
              <Input
                className={styles.input}
                placeholder="请输入申请人姓名"
                value={formData.applicantName}
                onInput={(e) => handleInputChange('applicantName', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>联系电话
              </Text>
              <Input
                className={styles.input}
                type="number"
                placeholder="请输入联系电话"
                value={formData.applicantPhone}
                onInput={(e) => handleInputChange('applicantPhone', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>地址</Text>
              <Input
                className={styles.input}
                placeholder="请输入地址"
                value={formData.applicantAddress}
                onInput={(e) => handleInputChange('applicantAddress', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>饲养经验</Text>
              <Textarea
                className={styles.textarea}
                placeholder="请描述饲养经验"
                value={formData.experience}
                onInput={(e) => handleInputChange('experience', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>申请原因
              </Text>
              <Textarea
                className={styles.textarea}
                placeholder="请描述申请原因"
                value={formData.reason}
                onInput={(e) => handleInputChange('reason', e.detail.value)}
              />
            </View>

            <View className={styles.submitBtn} onClick={handleSubmit}>
              <Text className={styles.submitBtnText}>提交申请</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default AdoptionManagePage;
