/**
 * 导入需要的ts
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/5/13
*/
import { App } from 'vue'
import { ElTabs, ElTabPane, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElCheckbox,
  ElRadioGroup, ElRadio, ElCheckboxGroup, ElInputNumber, ElSelect, ElOption, ElColorPicker,
  ElScrollbar, ElTag
} from 'element-plus'

export default function (app: App): App {
  return app.use(ElTabs).use(ElTabPane).use(ElButton).use(ElInput).use(ElForm).use(ElFormItem).use(ElRow)
    .use(ElCol).use(ElCheckbox).use(ElCheckboxGroup).use(ElRadio).use(ElRadioGroup).use(ElInputNumber).use(ElSelect)
    .use(ElOption).use(ElColorPicker).use(ElScrollbar).use(ElTag)
}
