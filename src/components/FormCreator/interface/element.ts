import type { SFCWithInstall } from 'element-plus/lib/utils/types'
import { ElCol, ElFormItem, ElForm } from 'element-plus'

export type ElColType = SFCWithInstall<typeof ElCol>
export type ElFormItemType = SFCWithInstall<typeof ElFormItem>
export type ElFormType = InstanceType<typeof ElForm>
