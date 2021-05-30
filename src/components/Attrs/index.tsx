import { defineComponent, computed, onMounted, reactive, toRaw } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormItemComponentType, FormModelType, ItemOptionsType, JsonUnknown } from '@/components/FormCreator/interface'
import style from './index.module.scss'
import { computedSfctStyleToForm } from '@/utils/style'
import eventBus from '@/utils/eventBus'
import { SfcStyleType } from '@/types/sfc'
export default defineComponent({
  name: 'Attrs',
  setup () {
    const store = useStore()
    const curComponent = computed(() => store.state.canvas.curComponent)
    const state = reactive({
      rules: [] as ItemOptionsType[]
    })

    const formChange = (cur: JsonUnknown, mode: FormModelType, type?: FormItemComponentType) => {
      console.log(cur, mode, type)
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
        <FormCreator rules={state.rules} onChange={(cur: JsonUnknown, mode: FormModelType, type?: FormItemComponentType) => formChange(cur, mode, type)} />
      </div>
    )
  }
})
