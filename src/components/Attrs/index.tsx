import { defineComponent, reactive, computed, watch } from 'vue'
import { useStore } from '@/store'
import { computedSfctStyleToForm } from '@/utils/style'
import FormCreator from '@/components/FormCreator'
import { ItemOptionsType } from '@/components/FormCreator/interface'
import { FormCreatorController } from '@/components/FormCreator/utils/FormCreatorController'
import style from './index.module.scss'
export default defineComponent({
  name: 'Attrs',
  props: {
    renderForm: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const store = useStore()
    const curComponent: any = computed(() => store.state.canvas.curComponent)
    const rulesDemo = computedSfctStyleToForm(curComponent.value?curComponent.value.style : {})
    const rules = reactive<Array<ItemOptionsType>>(rulesDemo)
    let instance: FormCreatorController
    const getInstance = (form: FormCreatorController) => {
      console.log(form.getFields())
      instance = form
    }
    
    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={rules} getInstance={getInstance}/>
      </div>
    )
  }
})