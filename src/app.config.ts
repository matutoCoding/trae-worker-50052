export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/treatment/index',
    'pages/feeding/index',
    'pages/adoption/index',
    'pages/reception/index',
    'pages/health-assess/index',
    'pages/treatment-record/index',
    'pages/feeding-manage/index',
    'pages/rehab-assess/index',
    'pages/release-track/index',
    'pages/adoption-manage/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#2E7D32',
    navigationBarTitleText: '野生动物救助站',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7F4'
  },
  tabBar: {
    color: '#8A9A8A',
    selectedColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/treatment/index',
        text: '治疗管理'
      },
      {
        pagePath: 'pages/feeding/index',
        text: '饲养管理'
      },
      {
        pagePath: 'pages/adoption/index',
        text: '放归领养'
      }
    ]
  }
})
