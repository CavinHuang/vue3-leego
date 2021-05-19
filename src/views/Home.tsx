import { defineComponent, ref } from 'vue'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import style from './home.module.scss'
// 右侧菜单类型名称
type RightTabNameType = 'attr' | 'animation' | 'events'

export default defineComponent({
  name: 'Home',
  setup () {
    const activeName = ref<RightTabNameType>('attr')
    const tabPosition = ref('left')

    const handleDrop = (e: DragEvent) => {
      console.log('开始', e)
    }

    const handleDragOver = (e: DragEvent) => {
      console.log('结束', e)
    }

    const handleMouseDown = (e: MouseEvent) => {
      console.log('按下', e)
    }

    const deselectCurComponent = (e: MouseEvent) => {
      console.log('松开', e)
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
