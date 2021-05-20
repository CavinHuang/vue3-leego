import { defineComponent, ref } from 'vue'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import style from './home.module.scss'
import { deepCopy } from '@/utils'
import generateID from '@/utils/generateID'
import componentList from '@/customer-component/config/sfc'
import { useStore } from '@/store'
// 右侧菜单类型名称
type RightTabNameType = 'attr' | 'animation' | 'events'

export default defineComponent({
  name: 'Home',
  setup () {
    const activeName = ref<RightTabNameType>('attr')
    const tabPosition = ref('left')
    const store = useStore()

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const component = deepCopy(componentList[e.dataTransfer?.getData('index')])
      component.style.top = e.offsetY
      component.style.left = e.offsetX
      component.id = generateID()
      store.commit('addComponent', { component })
      store.commit('recordSnapshot')
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      (e.dataTransfer as any).dropEffect = 'copy'
    }

    const handleMouseDown = (e: MouseEvent) => {
      store.commit('setClickComponentStatus', false)
    }

    const deselectCurComponent = (e: MouseEvent) => {
      if (!this.isClickComponent) {
        store.commit('setCurComponent', { component: null, index: null })
      }
      // 0 左击 1 滚轮 2 右击
      if (e.button != 2) {
        store.commit('hideContextMenu')
      }
    }

    return () => (
      <div class={style.home}>
        <Toolbar />
        <main>
          {/* <!-- 左侧组件列表 --> */}
          <section class="left">
            <el-tabs tab-position={tabPosition.value} class={style['left-tab']} stretch style="height: 200px;">
              <el-tab-pane label="基础组件">用户管理</el-tab-pane>
              <el-tab-pane label="营销组件">配置管理</el-tab-pane>
            </el-tabs>
          </section>
          {/* <!-- 中间画布 --> */}
          <section class="center">
            <div
              class="content"
              onDrop={(e: DragEvent) => handleDrop(e)}
              onDragover={(e: DragEvent) => handleDragOver(e)}
              onMousedown={(e: MouseEvent) => handleMouseDown(e)}
              onMouseup={(e: MouseEvent) => deselectCurComponent(e)}
            >
              <Editor />
            </div>
          </section>
          {/* <!-- 右侧属性列表 --> */}
          <section class="right">
            <el-tabs v-model={activeName.value}>
              <el-tab-pane label="属性" name="attr">
                <p class="placeholder">请选择组件</p>
              </el-tab-pane>
              <el-tab-pane label="动画" name="animation">
                <p class="placeholder">请选择组件</p>
              </el-tab-pane>
              <el-tab-pane label="事件" name="events">
                <p class="placeholder">请选择组件</p>
              </el-tab-pane>
            </el-tabs>
          </section>
        </main>
      </div>
    )
  }
})
