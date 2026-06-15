import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AnimalProvider } from './store/AnimalContext';
// 全局样式
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] Wildlife Rescue Station App initialized');
  }, []);

  useDidShow(() => {
    console.log('[App] App shown');
  });

  useDidHide(() => {
    console.log('[App] App hidden');
  });

  return (
    <AnimalProvider>
      {props.children}
    </AnimalProvider>
  );
}

export default App;
