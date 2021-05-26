import { defineComponent, computed, onMounted, reactive, toRaw } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormModelType, ItemOptionsType, JsonUnknown, ValidateOptionType } from '@/components/FormCreator/interface'
import { FormCreatorController } from '@/components/FormCreator/utils/FormCreatorController'
import style from './index.module.scss'
import { styleNameMap, selectKey, selectOptionsMap, computedSfctStyleToForm } from '@/utils/style'
import { deepCopy } from '@/utils'
import eventBus from '@/utils/eventBus'
export default defineComponent({
  name: 'Attrs',
  setup () {
    const store = useStore()
    const curComponent: any = computed(() => store.state.canvas.curComponent)
    let rulesCache: Array<ItemOptionsType> = []
    let state = reactive({
      rules: [] as ItemOptionsType[]
    })
    let instance: FormCreatorController
    const getInstance = (form: FormCreatorController) => {
      instance = form
    }

    const formChange = (cur: JsonUnknown, mode: FormModelType) => {
      rulesCache.forEach(item => {
        if (item.field === cur.field) {
          item.value = cur.value
        }
      })
      store.dispatch('canvas/setCusComponentStyle', Object.assign(curComponent.value.style, mode))
    }

    onMounted(() => {
      eventBus.$on('updateFormData', (data) => {
        state.rules = computedSfctStyleToForm(toRaw(data))
      })
    })

    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={state.rules} getInstance={getInstance} onChange={(cur: JsonUnknown, mode: FormModelType) => formChange(cur, mode)} />
      </div>
    )
  }
})
