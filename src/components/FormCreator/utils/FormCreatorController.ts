/**
 * 表单操作方法类
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/19
*/
import { FiledInputValueType, JsonUnknown } from '../interface'
interface FormModelType {
  [key: string]: FiledInputValueType
}

export class FormCreatorController {
  constructor (formRef: JsonUnknown, public formMode: FormModelType) {
  }

  /**
   * 设置表单的值
   * @param field
   * @param value
   */
  setValue (field: string | JsonUnknown, value: FiledInputValueType) {
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
  getFields () {
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
  validate () {}

  /**
   * 验证指定字段
   */
  validateField () {}

  /**
   * 获取表单数据
   */
  formData () {}

  /**
   * 重载表单
   */
  reload () {}
}
