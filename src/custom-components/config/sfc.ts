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
    icon: 'huodongzujian_huaban1',
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
    icon: 'huodongzujian-15',
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
    icon: 'huodongzujian-19',
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
        field: 'swiper-edit',
        src: require('@/assets/title.jpg')
      }
    ],
    icon: 'huodongzujian-20',
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
        value: true,
        props: {
          text: '开|关'
        }
      },
      {
        label: '滚动方向',
        changeType: 'attr',
        field: 'vertical',
        component: 'switch',
        value: false,
        props: {
          text: '横向|纵向'
        }
      },
      {
        label: '指示器颜色',
        changeType: 'attr',
        field: 'indicator-color',
        component: 'colorPicker',
        value: '#1989fa'
      }
    ],
    style: {
      width: 375,
      height: 200,
      borderColor: 'transparent',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid'
    }
  },
  {
    component: 'CustomerIcon',
    label: '图标',
    icon: 'tubiao',
    propValue: 'icon-tubiao',
    actions: [
      {
        component: 'input',
        label: '文本',
        changeType: 'attr',
        field: 'title',
        value: '图标'
      },
      {
        component: 'colorPicker',
        label: '文本颜色',
        changeType: 'attr',
        field: 'titleColor',
        value: '#333333'
      },
      {
        component: 'input',
        label: '跳转链接',
        changeType: 'attr',
        field: 'link',
        value: ''
      },
      {
        component: 'iconSelect',
        label: '图标',
        changeType: 'value'
      },
    ],
    style: {
      width: 34,
      height: 54,
      color: '#1989fa'
    }
  },
]
const all: ComponentAttrType[] = []
for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  all[i] = { ...commonAttr, ...item }
}

export default all
