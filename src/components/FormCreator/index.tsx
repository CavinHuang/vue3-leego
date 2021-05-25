/**
 * 动态表单组件
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/17
*/
import { defineComponent, PropType, ref, reactive, computed, watch } from 'vue'
import FormCreatorItem from './form-item'
import formCreatorModel from './utils/formCreatorModel'
import {
  ElFormType,
  FieldsConfigType,
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
    const formData = reactive({
      model: {} as FormModelType,
      rules: {} as JsonUnknown,
      fieldsConfig: [] as Array<FieldsConfigType>
    })
    // 返回操作实例
    const cformData = computed(() => formCreatorModel(props.rules))
    const formCreatorInstance = new FormCreatorController(formRef, props.rules)
    watch(cformData, () => {
      formCreatorInstance.resetData(cformData.value.model as FormModelType, cformData.value.rules, cformData.value.fieldsConfig)
    }, { immediate: true, deep: true })

    // 回传操作实例
    props.getInstance(formCreatorInstance)

    const onDataChange = (event: FiledInputValueType, type: FormItemComponentType, field: string) => {
      console.log(1)
      const mode = Object.assign({}, formData.model, { [field]: event })
      props.onChange({ field: field, value: event }, mode)
      formCreatorInstance.resetData(mode as FormModelType, formCreatorInstance.formModelData.rules, formData.fieldsConfig)
    }
    console.log(formCreatorInstance.formModelData)
    watch(formCreatorInstance.formModelData, (value, old) => {
      console.log(value, old)
      formData.model = value.formMode
      formData.rules = value.rules
      formData.fieldsConfig = value.fieldsConfig
    }, { immediate: true, deep: true })

    const itemRender = () => {
      return formData.fieldsConfig.map((config: any) => {
        const props: JsonUnknown = {}
        if (config.col && config.col.labelWidth) {
          props.labelWidth = config.col.labelWidth
        }
        return (
          <el-col {...config.col} key={config.field}>
            <el-form-item label={config.label} prop={config.field}>
              <FormCreatorItem {...{ attrs: config.attrs, component: config.component, options: config.options, value: formData.model[config.field], onDataChange: (event: FiledInputValueType, type: FormItemComponentType) => onDataChange(event, type, config.field) }} />
            </el-form-item>
          </el-col>
        )
      })
    }

    return () => (
      <el-form
        model={formData.model}
        rules={formData.rules}
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
