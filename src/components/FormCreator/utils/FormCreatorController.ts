/**
 * 表单操作方法类
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/19
*/
import {
  ElFormType,
  FieldsConfigType,
  FiledInputValueType,
  ItemOptionsType,
  JsonUnknown,
  ValidateCallback,
  FormModelType
} from '../interface'
import formCreatorModel from './formCreatorModel'
import { reactive, Ref } from 'vue'
import { ValidateFieldCallback } from 'element-plus/lib/el-form'

export class FormCreatorController {
  public formModelData = reactive({
    formMode: {} as FormModelType,
    rules: {} as JsonUnknown,
    fieldsConfig: [] as Array<FieldsConfigType>
  })
  constructor (public formRef: Ref<ElFormType | null>, public createRules: Array<ItemOptionsType>) {
    this.init()
  }

  /**
   * 初始化
   */
  private init () {
    const { model, rules, fieldsConfig } = formCreatorModel(this.createRules)
    this.formModelData.formMode = model
    this.formModelData.rules = rules
    this.formModelData.fieldsConfig = fieldsConfig
  }

  public resetData (mode: FormModelType, rules: JsonUnknown, fieldsConfig: Array<FieldsConfigType>) {
    this.formModelData.formMode = mode
    this.formModelData.rules = rules
    this.formModelData.fieldsConfig = fieldsConfig
  }

  public setMode (mode: FormModelType) {
    this.formModelData.formMode = mode
  }

  /**
   * 获取表单校验规则
   */
  getCheckRules (): JsonUnknown {
    return this.formModelData.rules
  }

  /**
   * 获取校验规则
   */
  getFieldConfig (): Array<FieldsConfigType> {
    return this.formModelData.fieldsConfig
  }

  /**
   * 设置表单的值
   * @param field
   * @param value
   */
  setValue (field: string | JsonUnknown, value: FiledInputValueType = ''): void {
    if (typeof field === 'string' && value) {
      this.formModelData.formMode[field] = value
    }
    if (field instanceof Object) {
      Object.assign(this.formModelData.formMode, field)
    }
  }

  /**
   * 获取字段
   */
  getFields (): FiledInputValueType {
    return Object.keys(this.formModelData.formMode)
  }

  /**
   * 获取指定字段的值
   * @param name
   */
  getValue (name: string): FiledInputValueType | null {
    if (this.formModelData.formMode[name]) {
      return this.formModelData.formMode[name]
    }
    return null
  }

  /**
   * 验证表单
   */
  validate (cb: ValidateCallback): void {
    if (this.formRef.value) {
      this.formRef.value.validate(cb)
    } else {
      const flag = true
      cb(flag)
    }
  }

  /**
   * 验证指定字段
   */
  validateField (field: string | string[], cb: ValidateFieldCallback): void {
    if (this.formRef.value) {
      this.formRef.value.validateField(field, cb)
    } else {
      const flag = true
      cb(flag)
    }
  }

  /**
   * 获取表单数据
   */
  formData (): FormModelType {
    return this.formModelData.formMode
  }

  /**
   * 重载表单
   */
  reload (): void {
    this.init()
    this.formRef.value && this.formRef.value.resetFields()
  }

  /**
   * 清除表单验证信息
   */
  clearValidate ():void {
    this.formRef.value && this.formRef.value.clearValidate()
  }
}
