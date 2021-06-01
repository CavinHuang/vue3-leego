/**
 * 图标选择
 * @author huangchunmao
 * @email sujinw@qq.com
 * @version v1.0.0
 * @date 2021/6/1
*/
import { defineComponent, ref, computed } from 'vue'
import iconData from './icon'
import style from './index.module.scss'
export default defineComponent({
  name: 'IconSelect',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const _index = ref(-1)
    const defaultIndex = computed(() => {
      return iconData.findIndex(item => item.icon === props.modelValue)
    })
    const currentIndex = computed<number>({
      get () {
        return _index.value === -1 ? defaultIndex.value : _index.value
      },
      set (value) {
        _index.value = value
      }
    })

    const selectIcon = (index: number) => {
      currentIndex.value = index
      emit('change', iconData[index].icon)
    }

    return () => (
      <div class={style['icon-select']}>
        <ul class='icon-list'>
          { iconData.map((icon, index) => {
            return (
              <li onClick={() => selectIcon(index)} class={[currentIndex.value === index ? 'active' : '']}>
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
