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
import { Ref } from 'vue'
import { ValidateFieldCallback } from 'element-plus/lib/el-form'

export class FormCreatorController {
  private formMode: FormModelType = {}
  private rules: JsonUnknown = {}
  private fieldsConfig: Array<FieldsConfigType> = []
  constructor (public formRef: Ref<ElFormType | null>, public createRules: Array<ItemOptionsType>) {
    this.init()
  }

  /**
   * 初始化
   */
  private init () {
    const { model, rules, fieldsConfig } = formCreatorModel(this.createRules)
    this.formMode = model
    this.rules = rules
    this.fieldsConfig = fieldsConfig
  }

  public resetData (mode: FormModelType, rules: JsonUnknown, fieldsConfig: Array<FieldsConfigType>) {
    this.formMode = mode
    this.rules = rules
    this.fieldsConfig = fieldsConfig
  }

  public setMode (mode: FormModelType) {
    this.formMode = mode
  }

  /**
   * 获取表单校验规则
   */
  getCheckRules (): JsonUnknown {
    return this.rules
  }

  /**
   * 获取校验规则
   */
  getFieldConfig (): Array<FieldsConfigType> {
    return this.fieldsConfig
  }

  /**
   * 设置表单的值
   * @param field
   * @param value
   */
  setValue (field: string | JsonUnknown, value: FiledInputValueType = ''): void {
    if (typeof field === 'string' && value) {
      this.formMode[field] = value
    }
    if (field instanceof Object) {
      Object.assign(this.formMode, field)
    }
  }

  /**
   * 获取字段
   */
  getFields (): FiledInputValueType {
    return Object.keys(this.formMode)
  }

  /**
   * 获取指定字段的值
   * @param name
   */
  getValue (name: string): FiledInputValueType | null {
    if (this.formMode[name]) {
      return this.formMode[name]
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
    return this.formMode
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
