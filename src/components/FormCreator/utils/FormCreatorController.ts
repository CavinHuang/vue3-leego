/**
 * 表单操作方法类
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/19
*/
import { FiledInputValueType, JsonUnknown } from '../interface'

export class FormCreatorController {
  constructor (formRef: any, formMode: any) {
  }

  /**
   * 设置表单的值
   * @param field
   * @param value
   */
  setValue (field: string | JsonUnknown, value: FiledInputValueType) {
  }

  /**
   * 获取字段
   */
  getFields () {}

  /**
   * 获取指定字段的值
   * @param name
   */
  getValue (name: string) {}

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
