/**
 * 全局组件导入
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/13
*/

import { App, defineAsyncComponent } from '@vue/runtime-core'
import useElement from './element'

function useCustomer (app: App): App {
  app.component('FormUploader', defineAsyncComponent(() => import('./FormCreator/form-item/form-uploader')))
  return app
}

export {
  useCustomer,
  useElement
}
