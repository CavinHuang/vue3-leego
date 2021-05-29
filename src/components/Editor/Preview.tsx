import { defineComponent, computed } from 'vue'
import ComponentWrapper from './ComponentWrapper'
import { changeStyleWithScale } from '@/utils/translate'
import { useStore } from '@/store'
import style from './index.module.scss'
export default defineComponent({
  props: {
    modelValue: Boolean,
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const store = useStore()
    const componentData = computed(() => store.state.canvas.componentData)
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)
    const close = () => {
      emit('update:modelValue', false)
    }
    return () => (
      props.modelValue ? <div class={style['preview-bg']}>
        <el-button onClick={() => close()} class="close">关闭</el-button>
        <div class="canvas-container">
          <div class="canvas" style={ { width: changeStyleWithScale(canvasStyleData.value.width) + 'px', height: changeStyleWithScale(canvasStyleData.value.height) + 'px' } }>
            {componentData.value.map(item => {
              return <ComponentWrapper config={item} />
            })}
          </div>
        </div>
      </div>
        : ''
    )
  }
})
