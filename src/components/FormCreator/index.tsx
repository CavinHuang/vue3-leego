/**
 * 动态表单组件
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/17
*/
import { defineComponent, PropType } from 'vue'
import FormCreatorItem from './form-item'
import formCreatorModel from './utils/formCreatorModel'
import { FiledInputValueType, FormItemComponentType, ItemOptionsType, JsonUnknown } from './interface'

export default defineComponent({
  name: 'form-creator',
  props: {
    rules: {
      type: Array as PropType<Array<ItemOptionsType>>,
      default: () => ([])
    }
  },
  setup (props) {
    const { model, rules, fieldsConfig } = formCreatorModel(props.rules)
    console.log('在用model', model)
    const onDataChange = (event: FiledInputValueType, type: FormItemComponentType, field: string) => {
      model[field] = event
    }

    const itemRender = () => {
      return fieldsConfig.map(config => {
        const props: JsonUnknown = {}
        if (config.col && config.col.labelWidth) {
          props.labelWidth = config.col.labelWidth
        }
        return (
          <el-col {...config.col} key={config.field}>
            <el-form-item label={config.label} prop={config.field}>
              <FormCreatorItem {...{ attrs: config.attrs, component: config.component, options: config.options, value: model[config.field], onDataChange: (event: any, type: FormItemComponentType) => onDataChange(event, type, config.field) }} />
            </el-form-item>
          </el-col>
        )
      })
    }

    return () => (
      <el-form
        model={model}
        rules={rules}
        inline={false}
        label-position={'left'}
        label-width={'130px'}
        label-suffix={'：'}
        size={'small'}
        ref='ruleForm'
      >
        <el-row>
          { itemRender() }
        </el-row>
      </el-form>
    )
  }
})
