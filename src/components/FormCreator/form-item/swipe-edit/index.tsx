import { defineComponent, PropType, ref, computed } from 'vue'
import style from './index.module.scss'
import { JsonUnknown } from '@/components/FormCreator/interface'
import { prop } from 'vue-class-component'

export default defineComponent({
  name: 'SwipeEdit',
  props: {
    modelValue: {
      type: Array as PropType<Array<JsonUnknown>>,
      default: () => ([])
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const _values = ref<Array<JsonUnknown>>([])
    const values = computed<Array<JsonUnknown>>({
      get () {
        return _values.value.length ? _values.value : props.modelValue
      },
      set (val) {
        _values.value = val
      }
    })
    const addGroup = () => {
      values.value.push({
        title: '默认标题',
        src: require('@/assets/title.jpg')
      })
    }

    const uploaderChange = (src: string, index: number) => {
      values.value[index].src = src
      emit('change', values.value)
    }

    return () => (
      <div class={style['swipe-edit']}>
        {values.value.map((item, index) => {
          return (
            <>
              <form-uploader field={'pic_' + index} showFileList={false} defaultSrc={item.src} onChange={(src: string) => uploaderChange(src, index)} />
              <el-input class='swipe-edit__input' placeholder='请输入标题' clearable v-model={item.title} />
            </>
          )
        })}
        <el-button size='mini' type='primary' onClick={() => addGroup()}>增加一组</el-button>
      </div>
    )
  }
})
