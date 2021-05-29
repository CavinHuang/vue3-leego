import { defineComponent, ref, computed, watch } from 'vue'
import { useStore, CanvasStyleType } from '@/store'
import eventBus from '@/utils/eventBus'
import Preview from '@/components/Editor/Preview'
import style from './index.module.scss'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Toolbar',
  setup () {
    const store = useStore()
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)
    const componentData = computed(() => store.state.canvas.componentData)
    const isShowPreview = ref(false)

    watch(isShowPreview, (value) => {
      console.log(value)
      if (!value) {
        handlePreviewChange()
      }
    })

    // 修改画布样式数据
    const canvasStyleChangeHandler = (field: keyof CanvasStyleType, e: Event): void => {
      const inputTarget = e.target as HTMLInputElement
      store.dispatch('canvas/setCanvasStyleData', { [field]: Number(inputTarget.value) })
    }

    const setH5 = () => {
      store.dispatch('canvas/setCanvasStyleData', { width: 375, height: 667 })
    }

    const setPC = () => {
      store.dispatch('canvas/setCanvasStyleData', { width: 1200, height: 740 })
    }

    function lock () {
      store.dispatch('canvasAction/lock')
    }

    function unlock () {
      store.dispatch('canvasAction/unlock')
    }

    function compose () {
      store.dispatch('canvasAction/compose')
      store.dispatch('snapshot/recordSnapshot')
    }

    function decompose () {
      store.dispatch('canvasAction/decompose')
      store.dispatch('snapshot/recordSnapshot')
    }

    function undo () {
      store.dispatch('canvasAction/undo')
    }

    function preview () {
      isShowPreview.value = true
      store.dispatch('canvas/setEditMode', 'preview')
    }

    function save () {
      localStorage.setItem('canvasData', JSON.stringify(componentData.value))
      localStorage.setItem('canvasStyle', JSON.stringify(canvasStyleData.value))
      ElMessage.success('保存成功')
    }

    function clearCanvas () {
      store.dispatch('canvas/setComponentData', [])
      store.dispatch('snapshot/recordSnapshot')
    }

    function handlePreviewChange () {
      store.dispatch('canvas/setEditMode', 'edit')
    }

    eventBus.$on('preview', preview)
    eventBus.$on('save', save)
    eventBus.$on('clearCanvas', clearCanvas)

    // <el-button onClick={ () => redo() }>重做</el-button>
    return () => (
      <>
        <div class={style.toolbar}>
          <el-button onClick={ () => undo() }>撤消</el-button>
          <el-button onClick={ () => preview() } style="margin-left: 10px;">预览</el-button>
          <el-button onClick={ () => save() }>保存</el-button>
          <el-button onClick={ () => clearCanvas() }>清空画布</el-button>
          <el-button onClick={ () => compose() }>组合</el-button>
          <el-button onClick={ () => decompose() }>拆分</el-button>
          <el-button onClick={ () => lock() }>锁定</el-button>
          <el-button onClick={ () => unlock() }>解锁</el-button>
          <div class="canvas-config">
            <span>画布大小</span>
            <input value={canvasStyleData.value.width} onInput={(e: Event) => canvasStyleChangeHandler('width', e)} />
            <span>*</span>
            <input value={canvasStyleData.value.height} onClick={(e: Event) => canvasStyleChangeHandler('height', e)} />
          </div>
          <el-button size='mini' onClick={ () => setH5()}>H5</el-button>
          <el-button size='mini'onClick={ () => setPC()}>PC</el-button>
          <div class="canvas-config">
            <span>画布比例</span>
            <input value={canvasStyleData.value.scale} onInput={(e: Event) => canvasStyleChangeHandler('scale', e)} /> %
          </div>
        </div>
        <Preview v-model={isShowPreview.value} />
      </>
    )
  }
})
