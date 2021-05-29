import { defineComponent, computed, onMounted, reactive, toRaw } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormModelType, ItemOptionsType, JsonUnknown } from '@/components/FormCreator/interface'
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

    const formChange = (cur: JsonUnknown, mode: FormModelType) => {
      if (curComponent.value) {
        store.dispatch('canvas/setCusComponentStyle', Object.assign(curComponent.value.style, mode))
      }
    }

    onMounted(() => {
      eventBus.$on<SfcStyleType>('updateFormData', data => {
        state.rules = computedSfctStyleToForm(toRaw(data))
      })
    })

    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={state.rules} onChange={(cur: JsonUnknown, mode: FormModelType) => formChange(cur, mode)} />
      </div>
    )
  }
})
