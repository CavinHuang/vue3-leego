import { defineComponent } from 'vue'
import componentList from '@/custom-components/config/sfc'
import style from './index.module.scss'

export default defineComponent({
  name: 'ComponentsList',
  setup () {
    const handleDragStart = (e: DragEvent) => {
      if (e.dataTransfer && e.target) {
        e.dataTransfer.setData('index', (e.target as HTMLDivElement).getAttribute('data-index') || '1')
      }
    }
    return () => (
      <div onDragstart={(e: DragEvent) => handleDragStart(e)} class={style['component-list']}>
        {componentList.map((item, index) => {
          return (
            <div class="list" draggable data-index={index}>
              <span class={['iconfont', 'icon-' + item.icon]} />
              <span>{ item.label }</span>
            </div>
          )
        })}
      </div>
    )
  }
})
