import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import FormCreator from '@/components/FormCreator'
import { FormModelType, ItemOptionsType, JsonUnknown, ValidateOptionType } from '@/components/FormCreator/interface'
import { FormCreatorController } from '@/components/FormCreator/utils/FormCreatorController'
import style from './index.module.scss'
import { styleNameMap, selectKey, selectOptionsMap } from '@/utils/style'
import { deepCopy } from '@/utils'
export default defineComponent({
  name: 'Attrs',
  setup () {
    const store = useStore()
    const curComponent: any = computed(() => store.state.canvas.curComponent)
    const rules = computed(() => {
      const ruleeData: Array<ItemOptionsType> = []
      const style = curComponent.value ? curComponent.value.style : {}
      const colorReg = /color/ig
      const renderStyleKes = Object.keys(styleNameMap)
      for (const k in style) {
        if (!renderStyleKes.includes(k)) continue
        const item = style[k]
        if (colorReg.test(k)) {
          ruleeData.push({
            type: 'colorPicker',
            title: styleNameMap[k],
            value: item,
            field: k
          })
        } else if (selectKey.includes(k)) {
          let options: Array<ValidateOptionType> = []
          if (k === 'textAlign') {
            options = selectOptionsMap.textAlignOptions
          } else if (k === 'borderStyle') {
            options = selectOptionsMap.borderStyleOptions
          } else {
            options = selectOptionsMap.verticalAlignOptions
          }
          ruleeData.push({
            type: 'select',
            title: styleNameMap[k],
            value: item,
            field: k,
            props: {
              multiple: false
            },
            options
          })
        } else if (typeof item === 'number') {
          ruleeData.push({
            type: 'inputNumber',
            title: styleNameMap[k],
            value: item,
            field: k
          })
        } else {
          ruleeData.push({
            type: 'input',
            title: styleNameMap[k],
            value: item,
            field: k,
            props: {
              type: 'text'
            }
          })
        }
      }
      return ruleeData
    })
    let instance: FormCreatorController
    const getInstance = (form: FormCreatorController) => {
      console.log(form.getFields())
      instance = form
    }

    const formChange = (cur: JsonUnknown, mode: FormModelType) => {
      console.log('【触发数据更新】', cur, mode)
      console.log(curComponent)
      // store.dispatch('canvas/setCusComponentStyle', deepCopy(mode))
    }

    return () => (
      <div class={style['attr-list']}>
        <FormCreator rules={rules.value} getInstance={getInstance} onChange={(cur: JsonUnknown, mode: FormModelType) => formChange(cur, mode)} />
      </div>
    )
  }
})
