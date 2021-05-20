import { defineComponent, reactive } from 'vue'
import FormCreator from '@/components/FormCreator'
import { ItemOptionsType } from '@/components/FormCreator/interface'
import { FormCreatorController } from '@/components/FormCreator/utils/FormCreatorController'

export default defineComponent({
  name: 'test-form-creator',
  setup () {
    const rules = reactive<Array<ItemOptionsType>>([
      {
        type: 'input',
        title: '商品名称',
        field: 'goods_name',
        value: 'iphone 7',
        col: {
          span: 12,
          labelWidth: 150
        },
        props: {
          type: 'text'
        },
        validate: [
          { required: true, message: '请输入goods_name', trigger: 'blur' }
        ]
      },
      {
        type: 'checkbox',
        title: '标签',
        field: 'label',
        value: ['1', '2', '3'],
        options: [
          { value: '1', label: '好用', disabled: true },
          { value: '2', label: '方便', disabled: false },
          { value: '3', label: '实用', disabled: false },
          { value: '4', label: '有效', disabled: false }
        ]
      },
      {
        type: 'inputNumber',
        field: 'price',
        title: '价格',
        value: 1,
        props: {
          precision: 2
        }
      },
      {
        type: 'radio',
        title: '是否包邮',
        field: 'is_postage',
        value: '0',
        options: [
          { value: '0', label: '不包邮', disabled: false },
          { value: '1', label: '包邮', disabled: false }
        ]
      },
      {
        type: 'select',
        field: 'cate_id',
        title: '产品分类',
        value: ['104', '105'],
        options: [
          { value: '104', label: '生态蔬菜', disabled: false },
          { value: '105', label: '新鲜水果', disabled: false }
        ],
        props: {
          multiple: true
        }
      },
      {
        type: 'colorPicker',
        field: 'color',
        title: '颜色',
        value: '#ff7271'
      }
    ])
    let instance: FormCreatorController
    const getInstance = (form: FormCreatorController) => {
      console.log(form.getFields())
      instance = form
    }
    setTimeout(() => {
      instance.setValue('goods_name', '小米p20')
      console.log(instance.formData())
    }, 1000)

    setTimeout(() => {
      instance.reload()
      console.log(instance.formData())
    }, 2000)

    return () => (
      <>
        <FormCreator rules={rules} getInstance={getInstance}/>
      </>
    )
  }
})
