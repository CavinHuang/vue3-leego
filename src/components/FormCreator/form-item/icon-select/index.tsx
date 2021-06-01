/**
 * 图标选择
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/6/1
*/
import { defineComponent } from 'vue'
import iconData from './icon'
import style from './index.module.scss'
export default defineComponent({
  name: 'IconSelect',
  setup () {
    return () => (
      <div class={style['icon-select']}>
        <ul class='icon-list'>
        { iconData.map(icon => {
          return (
            <li>
              <span>
                <el-tooltip content={icon.title}>
                  <i class={['iconfont', icon.icon]} />
                </el-tooltip>
              </span>
            </li>
          )
        }) }
        </ul>
      </div>
    )
  }
})
