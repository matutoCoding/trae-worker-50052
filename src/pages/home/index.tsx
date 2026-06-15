import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useAnimal } from '../../store/AnimalContext';
import AnimalCard from '../../components/AnimalCard';
import StatCard from '../../components/StatCard';
import { formatDate } from '../../utils';
import { TodoItem } from '../../types/animal';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { animals, statistics, todos, toggleTodo } = useAnimal();
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(() => {
    console.log('[HomePage] Page shown');
  });

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const handleRefresh = () => {
    setRefreshing(true);
    console.log('[HomePage] Pull to refresh');
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const recentAnimals = useMemo(() => {
    return [...animals]
      .sort((a, b) => new Date(b.receiveDate).getTime() - new Date(a.receiveDate).getTime())
      .slice(0, 4);
  }, [animals]);

  const pendingTodos = useMemo(() => {
    return todos.filter(t => t.status === 'pending').slice(0, 5);
  }, [todos]);

  const quickActions = [
    { icon: '📥', text: '接收登记', path: '/pages/reception/index', colorClass: styles.actionIcon1 },
    { icon: '🏥', text: '健康评估', path: '/pages/health-assess/index', colorClass: styles.actionIcon2 },
    { icon: '💊', text: '治疗记录', path: '/pages/treatment-record/index', colorClass: styles.actionIcon3 },
    { icon: '🍖', text: '饲养管理', path: '/pages/feeding-manage/index', colorClass: styles.actionIcon4 },
    { icon: '💪', text: '康复评估', path: '/pages/rehab-assess/index', colorClass: styles.actionIcon5 },
    { icon: '🌲', text: '放归跟踪', path: '/pages/release-track/index', colorClass: styles.actionIcon6 },
    { icon: '🏠', text: '领养送养', path: '/pages/adoption-manage/index', colorClass: styles.actionIcon7 },
  ];

  const handleActionClick = (path: string) => {
    console.log('[HomePage] Navigate to:', path);
    Taro.navigateTo({ url: path }).catch(err => {
      console.error('[HomePage] Navigation error:', err);
      Taro.showToast({ title: '页面开发中', icon: 'none' });
    });
  };

  const handleTodoToggle = (id: string) => {
    console.log('[HomePage] Toggle todo:', id);
    toggleTodo(id);
    const todo = todos.find(t => t.id === id);
    if (todo && todo.status === 'pending') {
      Taro.showToast({ title: '任务已完成', icon: 'success' });
    }
  };

  const getTodoTagClass = (type: string) => {
    const classMap: Record<string, string> = {
      feeding: styles.todoTagFeeding,
      treatment: styles.todoTagTreatment,
      clean: styles.todoTagClean,
      check: styles.todoTagCheck
    };
    return classMap[type] || styles.todoTagCheck;
  };

  const getTodoTypeText = (type: string) => {
    const textMap: Record<string, string> = {
      feeding: '投喂',
      treatment: '治疗',
      clean: '清洁',
      check: '检查'
    };
    return textMap[type] || type;
  };

  const today = formatDate(new Date());

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          title='正在刷新...'
          color='#2E7D32'
        />
      }
    >
      <View className={styles.header}>
        <View className={styles.welcomeRow}>
          <View>
            <Text className={styles.welcomeText}>欢迎使用</Text>
            <Text className={styles.title}>野生动物救助站</Text>
            <Text className={styles.dateText}>{today}</Text>
          </View>
          <View className={styles.weatherBadge}>
            <Text className={styles.weatherText}>🌤️ 25°C</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsGrid}>
          <StatCard title='总救助数' value={statistics.totalAnimals} color='primary' />
          <StatCard title='治疗中' value={statistics.treatingCount} color='warning' />
          <StatCard title='已健康' value={statistics.healthyCount} color='success' />
          <StatCard title='可领养' value={statistics.adoptableCount} color='accent' />
          <StatCard title='已放归' value={statistics.releasedCount} color='info' />
          <StatCard title='已领养' value={statistics.adoptedCount} color='success' />
        </View>

        <View className={styles.quickActions}>
          <Text className={styles.quickActionsTitle}>快捷功能</Text>
          <ScrollView className={styles.actionsScroll} scrollX>
            <View className={styles.actionsContainer}>
              {quickActions.map((action, index) => (
                <View
                  key={index}
                  className={styles.actionItem}
                  onClick={() => handleActionClick(action.path)}
                >
                  <View className={`${styles.actionIcon} ${action.colorClass}`}>
                    <Text>{action.icon}</Text>
                  </View>
                  <Text className={styles.actionText}>{action.text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近接收</Text>
            <View className={styles.moreBtn} onClick={() => Taro.showToast({ title: '更多功能开发中', icon: 'none' })}>
              <Text>更多</Text>
              <Text>›</Text>
            </View>
          </View>
          {recentAnimals.map(animal => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>今日待办</Text>
            <View className={styles.moreBtn} onClick={() => Taro.showToast({ title: '更多功能开发中', icon: 'none' })}>
              <Text>全部</Text>
              <Text>›</Text>
            </View>
          </View>
          <View className={styles.todoList}>
            {pendingTodos.length > 0 ? (
              pendingTodos.map((todo: TodoItem) => (
                <View
                  key={todo.id}
                  className={styles.todoItem}
                  onClick={() => handleTodoToggle(todo.id)}
                >
                  <View className={`${styles.todoCheckbox} ${todo.status === 'completed' ? styles.todoCheckboxChecked : ''}`} />
                  <View className={styles.todoContent}>
                    <Text className={`${styles.todoTitle} ${todo.status === 'completed' ? styles.todoTitleCompleted : ''}`}>
                      {todo.title}
                      {todo.animalName && ` - ${todo.animalName}`}
                    </Text>
                    <View className={styles.todoMeta}>
                      <Text className={styles.todoTime}>{todo.time}</Text>
                      <Text className={`${styles.todoTag} ${getTodoTagClass(todo.type)}`}>
                        {getTodoTypeText(todo.type)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>暂无待办任务</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
