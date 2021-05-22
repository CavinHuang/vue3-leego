/**
 * 动态表单组件
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/17
*/
import { defineComponent, PropType, ref } from 'vue'
import FormCreatorItem from './form-item'
import {
  ElFormType,
  FiledInputValueType,
  FormItemComponentType,
  FormModelType,
  ItemOptionsType,
  JsonUnknown
} from './interface'
import { FormCreatorController } from './utils/FormCreatorController'

export default defineComponent({
  name: 'form-creator',
  props: {
    rules: {
      type: Array as PropType<Array<ItemOptionsType>>,
      default: () => ([])
    },
    getInstance: {
      type: Function as PropType<(instance: FormCreatorController) => void>,
      default: () => ({})
    },
    onChange: {
      type: Function as PropType<(value: FormModelType, model: FormModelType) => void>,
      default: () => {}
    }
  },
  setup (props) {
    const formRef = ref<ElFormType | null>(null)

    // 返回操作实例
    const formCreatorInstance = new FormCreatorController(formRef, props.rules)
    const fieldsConfig = formCreatorInstance.getFieldConfig()
    const model = formCreatorInstance.formData()
    const rules = formCreatorInstance.getCheckRules()
    // 回传操作实例
    props.getInstance(formCreatorInstance)

    const onDataChange = (event: FiledInputValueType, type: FormItemComponentType, field: string) => {
      model[field] = event
      props.onChange({ [field]: event }, model)
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
              <FormCreatorItem {...{ attrs: config.attrs, component: config.component, options: config.options, value: model[config.field], onDataChange: (event: FiledInputValueType, type: FormItemComponentType) => onDataChange(event, type, config.field) }} />
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
        label-width={'90px'}
        label-suffix={'：'}
        size={'small'}
        ref={formRef}
      >
        <el-row>
          { itemRender() }
        </el-row>
      </el-form>
    )
  }
})
