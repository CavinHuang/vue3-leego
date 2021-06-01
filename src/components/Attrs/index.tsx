import { defineComponent, computed, onMounted, reactive, toRaw } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormItemComponentType, FormModelType, ItemOptionsType, JsonUnknown } from '@/components/FormCreator/interface'
import style from './index.module.scss'
import { computedSfctStyleToForm } from '@/utils/style'
import eventBus from '@/utils/eventBus'
import { ActionChangeType, SfcStyleType } from '@/types/sfc'
export default defineComponent({
  name: 'Attrs',
  setup () {
    const store = useStore()
    const curComponent = computed(() => store.state.canvas.curComponent)
    const state = reactive({
      rules: [] as ItemOptionsType[]
    })

    const formChange = (cur: JsonUnknown, mode: FormModelType, type?: FormItemComponentType, changeType?: ActionChangeType) => {
      console.log(cur, mode, type, changeType)
      if (changeType === 'attr') {
        if (curComponent.value) {
          curComponent.value.props = curComponent.value.props || {}
          store.dispatch('canvas/updateCurComponent', Object.assign(curComponent.value.props, { [cur.field]: cur.value }))
        }
        return
      }
      if (changeType === 'value') {
        if (curComponent.value) {
          curComponent.value.props = curComponent.value.props || {}
          store.dispatch('canvas/updateCurComponent', { propValue: cur.value })
        }
        return
      }
      if (type === 'form-uploader' && cur.field === 'src') {
        store.dispatch('canvas/updateCurComponent', { propValue: cur.value })
        return
      }
      if (curComponent.value) {
        store.dispatch('canvas/setCusComponentStyle', Object.assign(curComponent.value.style, mode))
      }
    }

    onMounted(() => {
      eventBus.$on<SfcStyleType>('updateFormData', data => {
        if (curComponent.value) {
          state.rules = computedSfctStyleToForm(toRaw(data), curComponent.value)
        }
      })
    })

    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={state.rules} onChange={(cur: JsonUnknown, mode: FormModelType, type?: FormItemComponentType, changeType?: ActionChangeType) => formChange(cur, mode, type, changeType)} />
      </div>
    )
  }
})
