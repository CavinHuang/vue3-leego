// 公共样式
import { CommonAttrType, CommonStyleType, ComponentAttrType, ComponentType } from '@/types/sfc'

export const commonStyle: CommonStyleType = {
  rotate: 0,
  opacity: 1
}

export const commonAttr: CommonAttrType = {
  id: -1,
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false // 是否锁定组件
}

// 编辑器左侧组件列表
const list: Array<ComponentType> = [
  {
    component: 'VText',
    label: '文字',
    propValue: '双击编辑文字',
    icon: 'wenben',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 0,
      letterSpacing: 0,
      textAlign: '',
      color: '',
      borderStyle: '',
      borderWidth: 1,
      borderColor: '#000'
    }
  },
  {
    component: 'VButton',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    style: {
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '',
      borderRadius: 0,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: 0,
      textAlign: '',
      color: '',
      backgroundColor: ''
    }
  },
  {
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    propValue: require('@/assets/title.jpg'),
    style: {
      width: 300,
      height: 200,
      borderRadius: 0
    }
  },
  {
    component: 'RectShape',
    label: '矩形',
    propValue: '&nbsp;',
    icon: 'juxing',
    style: {
      width: 200,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: 0,
      textAlign: 'center',
      color: '',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid',
      verticalAlign: 'middle'
    }
  },
  {
    component: 'Swiper',
    label: '轮播图',
    propValue: [
      {
        title: '默认标题',
        src: require('@/assets/title.jpg')
      }
    ],
    icon: 'tupian',
    actions: [
      {
        label: '图片',
        component: 'swipe-edit'
      },
      {
        label: '指示器',
        changeType: 'attr',
        field: 'show-indicators',
        component: 'switch',
        value: 1,
        options: [
          { label: '开', value: 1 },
          { label: '关', value: 0 }
        ]
      }
    ],
    style: {
      width: 200,
      height: 200,
      borderColor: 'transparent',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid'
    }
  }
]
const all: ComponentAttrType[] = []
for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  all[i] = { ...commonAttr, ...item }
}

export default all
