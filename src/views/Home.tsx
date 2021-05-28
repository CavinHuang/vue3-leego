import { defineComponent, ref, computed } from 'vue'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import ComponentsList from '@/components/ComponentList'
import AnimationList from '@/components/AnimationList'
import Attrs from '@/components/Attrs'
import style from './home.module.scss'
import { deepCopy } from '@/utils'
import generateID from '@/utils/generateID'
import componentList from '@/custom-components/config/sfc'
import { useStore } from '@/store'
// 右侧菜单类型名称
type RightTabNameType = 'attr' | 'animation' | 'events'

export default defineComponent({
  name: 'Home',
  setup () {
    const activeName = ref<RightTabNameType>('attr')
    const tabPosition = ref('left')
    const store = useStore()
    const isClickComponent = computed(() => store.state.canvas.isClickComponent)
    const curComponent = computed(() => store.state.canvas.curComponent)

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const index = e.dataTransfer ? Number(e.dataTransfer.getData('index')) : 0
      const component = deepCopy(componentList[index])
      component.style.top = e.offsetY
      component.style.left = e.offsetX
      component.id = generateID()
      store.dispatch('canvas/addComponent', { component })
      store.dispatch('snapshot/recordSnapshot')
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'
      }
    }

    const handleMouseDown = () => {
      store.dispatch('canvas/setClickComponentStatus', false)
    }

    const deselectCurComponent = (e: MouseEvent) => {
      console.log('触发首页事件')
      if (!isClickComponent.value) {
        store.dispatch('canvas/setCurComponent', { component: null, index: null })
      }
      // 0 左击 1 滚轮 2 右击
      if (e.button !== 2) {
        store.dispatch('contextMenu/hideContextMenu')
      }
    }

    return () => (
      <div class={style.home}>
        <Toolbar />
        <main>
          {/* <!-- 左侧组件列表 --> */}
          <section class="left">
            <el-tabs tab-position={tabPosition.value} class={style['left-tab']} stretch style="height: 200px;">
              <el-tab-pane v-slots={{
                default: () => <ComponentsList />,
                label: () => (
                  <div class="el-tab-lable">
                    <i class='el-icon-cpu'/>
                    <span>基础组件</span>
                  </div>
                )
              }} />
              <el-tab-pane v-slots={{
                default: () => '营销组件',
                label: () => (
                  <div class="el-tab-lable">
                    <i class='el-icon-present'></i>
                    <span>营销组件</span>
                  </div>
                )
              }}/>
            </el-tabs>
          </section>
          { /* <!-- 中间画布 --> */ }
          <section class="center">
            <div
              class="content"
              onDrop={ (e: DragEvent) => handleDrop(e) }
              onDragover={ (e: DragEvent) => handleDragOver(e) }
              onMousedown={ () => handleMouseDown() }
              onMouseup={ (e: MouseEvent) => deselectCurComponent(e) }
            >
              <Editor />
            </div>
          </section>
          {/* <!-- 右侧属性列表 --> */}
          <section class="right">
            <el-tabs v-model={activeName.value}>
              <el-tab-pane label="属性" name="attr">
                {curComponent.value ? <Attrs /> : <p class="placeholder">请选择组件</p>}
              </el-tab-pane>
              <el-tab-pane label="动画" name="animation">
                { curComponent.value ? <AnimationList /> : <p class="placeholder">请选择组件</p>}
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
