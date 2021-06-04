import { computed, defineComponent, PropType } from 'vue'
import style from './index.module.scss'
import { ComponentAttrType } from '@/types/sfc'

export default defineComponent({
  name: 'CustomerIcon',
  props: {
    propValue: {
      type: String,
      default: ''
    },
    element: {
      type: Object as PropType<ComponentAttrType>
    },
    title: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const isIcon = () => true
    const actions = props.element?.actions || []
    const actionTitle = actions.find(item => item.field === 'title')
    const title = computed(() => props.title || (actionTitle ? actionTitle.value : ''))
    const computedFontSize = () => {
      if (props.element) {
        const cWidth = props.element.style.width!
        return {
          icon: cWidth,
          title: Math.floor((cWidth * 14) / 34)
        }
      }
      return {
        icon: 32,
        title: 14
      }
    }
    const fontSize = computed(computedFontSize)
    return () => (
      props.propValue ? (
        <div class={style['icon-wrap']}>
          <div class='icon-container'>
            { isIcon() ? <i class={['iconfont', props.propValue]} style={{ fontSize: fontSize.value.icon + 'px' }} /> : <img src={props.propValue} alt={title.value as string} /> }
          </div>
          { title.value ? <div class='icon-title' style={{ color: props.titleColor, fontSize: fontSize.value.title + 'px' }}>{ title.value }</div> : '' }
        </div>
      ) : ''
    )
  }
})
