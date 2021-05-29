import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
import style from './index.module.scss'

export default defineComponent({
  name: 'ContextMenu',
  setup () {
    const store = useStore()
    const menuTop = computed(() => store.state.contextMenu.menuTop)
    const menuLeft = computed(() => store.state.contextMenu.menuLeft)
    const menuShow = computed(() => store.state.contextMenu.menuShow)
    const curComponent = computed(() => store.state.canvas.curComponent)

    function lock () {
      store.dispatch('canvasAction/lock')
    }

    function unlock () {
      store.dispatch('canvasAction/unlock')
    }

    // 点击菜单时不取消当前组件的选中状态
    function handleMouseUp () {
      store.dispatch('canvas/setClickComponentStatus', true)
    }

    function cut () {
      store.dispatch('canvasAction/cut')
    }

    function copy () {
      store.dispatch('canvasAction/copy')
    }

    function paste () {
      store.dispatch('canvasAction/paste', true)
      store.dispatch('snapshot/recordSnapshot')
    }

    function deleteComponent () {
      store.dispatch('canvas/deleteComponent')
      store.dispatch('snapshot/recordSnapshot')
    }

    function upComponent () {
      store.dispatch('canvasAction/upComponent')
      store.dispatch('snapshot/recordSnapshot')
    }

    function downComponent () {
      store.dispatch('canvasAction/downComponent')
      store.dispatch('snapshot/recordSnapshot')
    }

    function topComponent () {
      store.dispatch('canvasAction/topComponent')
      store.dispatch('snapshot/recordSnapshot')
    }

    function bottomComponent () {
      store.dispatch('canvasAction/bottomComponent')
      store.dispatch('snapshot/recordSnapshot')
    }
    const hasCurSfc = () => {
      return (
        !(curComponent.value && curComponent.value.isLock)
          ? <>
            <li onClick={() => copy()}>复制</li>
            <li onClick={() => paste()}>粘贴</li>
            <li onClick={() => cut()}>剪切</li>
            <li onClick={() => deleteComponent()}>删除</li>
            <li onClick={() => lock()}>锁定</li>
            <li onClick={() => topComponent()}>置顶</li>
            <li onClick={() => bottomComponent()}>置底</li>
            <li onClick={() => upComponent()}>上移</li>
            <li onClick={() => downComponent()}>下移</li>
          </>
          : <li onClick={() => unlock()}>解锁</li>
      )
    }
    const items = () => {
      return curComponent.value ? hasCurSfc() : <li onClick={() => paste()}>粘贴</li>
    }
    return () => (
      <div class={style.contextmenu} v-show={menuShow.value} style={{ top: menuTop.value + 'px', left: menuLeft.value + 'px' }}>
        <ul onMouseup={() => handleMouseUp()}>
          {items()}
        </ul>
      </div>
    )
  }
})
