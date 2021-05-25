import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormModelType, ItemOptionsType, JsonUnknown, ValidateOptionType } from '@/components/FormCreator/interface'
import { FormCreatorController } from '@/components/FormCreator/utils/FormCreatorController'
import style from './index.module.scss'
import { styleNameMap, selectKey, selectOptionsMap, computedSfctStyleToForm } from '@/utils/style'
import { deepCopy } from '@/utils'
import {prop} from "vue-class-component";
export default defineComponent({
  name: 'Attrs',
  setup () {
    const store = useStore()
    const curComponent: any = computed(() => store.state.canvas.curComponent)
    let rulesCache: Array<ItemOptionsType> = []
    const rules = computed(() => computedSfctStyleToForm(curComponent.value?.style))
    let instance: FormCreatorController
    const getInstance = (form: FormCreatorController) => {
      console.log(form.getFields())
      instance = form
    }

    const formChange = (cur: JsonUnknown, mode: FormModelType) => {
      console.log('【触发数据更新】', cur, mode)
      console.log(curComponent)
      rulesCache.forEach(item => {
        if (item.field === cur.field) {
          item.value = cur.value
        }
      })
      store.dispatch('canvas/setCusComponentStyle', mode)
      // store.dispatch('canvas/setUpdateForm', 'form')
    }

    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={rules.value} getInstance={getInstance} onChange={(cur: JsonUnknown, mode: FormModelType) => formChange(cur, mode)} />
      </div>
    )
  }
})
