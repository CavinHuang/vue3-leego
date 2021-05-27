import { defineComponent, ref, computed } from 'vue'
import { useStore, CanvasStyleType } from '@/store'
import eventBus from '@/utils/eventBus'

import style from './index.module.scss'
import { deepCopy } from '@/utils'
import { JsonUnknown } from '../FormCreator/interface'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Toolbar',
  setup() {
    const store = useStore()
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)
    const componentData = computed(() => store.state.canvas.componentData)
    const areaData = computed(() => store.state.canvas.areaData)
    const curComponent = computed(() => store.state.canvas.curComponent)
    const isShowPreview = ref(false)
    const needToChange = [
      'top',
      'left',
      'width',
      'height',
      'fontSize',
      'borderWidth'
    ]
    const scale = ref('100%')
    let timer: number

    // 修改画布样式数据
    const canvasStyleChangeHandler = (field: keyof CanvasStyleType, e: Event): void => {
      const inputTarget = e.target as HTMLInputElement
      store.dispatch('canvas/setCanvasStyleData', { [field]: Number(inputTarget.value) })
    }

    const setH5 = () => {
      store.dispatch('canvas/setCanvasStyleData', { width: 375, height: 667})
    }

    const setPC = () => {
      store.dispatch('canvas/setCanvasStyleData', { width: 1200, height: 740})
    }

    function format (value: number) {
      const _scale = scale.value
      return value * parseInt(_scale) / 100
    }

    function getOriginStyle (value: number) {
      const scale = canvasStyleData.value.scale.toString()
      const result = value / (parseInt(scale) / 100)
      return result
    }

    function handleScaleChange() {
      clearTimeout(timer)
      // 画布比例设一个最小值，不能为 0
      // eslint-disable-next-line no-bitwise
      scale.value = (~~scale.value).toString() || '1'
      timer = window.setTimeout(() => {
        const _componentData = deepCopy(componentData.value)
        _componentData.forEach((component: JsonUnknown) => {
          Object.keys(component.style).forEach(key => {
            if (needToChange.includes(key)) {
              // 根据原来的比例获取样式原来的尺寸
              // 再用原来的尺寸 * 现在的比例得出新的尺寸
              component.style[key] = format(getOriginStyle(component.style[key]))
            }
          })
        })

        store.dispatch('canvas/setComponentData', componentData)
        store.dispatch('canvas/setCanvasStyle', {
          ...canvasStyleData.value,
          scale: scale.value,
        })
      }, 500)
    }

    function lock() {
      store.dispatch('canvasAction/lock')
    }

    function unlock() {
      store.dispatch('canvasAction/unlock')
    }

    function compose() {
      store.dispatch('canvasAction/compose')
      store.dispatch('snapshot/recordSnapshot')
    }

    function decompose() {
      store.dispatch('canvasAction/decompose')
      store.dispatch('snapshot/recordSnapshot')
    }

    function undo() {
      store.dispatch('canvasAction/undo')
    }

    function redo() {
      store.dispatch('canvasAction/redo')
    }


    function preview() {
      isShowPreview.value = true
      // store.commit('setEditMode', 'preview')
    }

    function save() {
      localStorage.setItem('canvasData', JSON.stringify(componentData.value))
      localStorage.setItem('canvasStyle', JSON.stringify(canvasStyleData.value))
      ElMessage.success('保存成功')
    }

    function clearCanvas() {
      store.dispatch('canvas/setComponentData', [])
      store.dispatch('snapshot/recordSnapshot')
    }

    function handlePreviewChange() {
      // this.$store.commit('setEditMode', 'edit')
    }

    eventBus.$on('preview', preview)
    eventBus.$on('save', save)
    eventBus.$on('clearCanvas', clearCanvas)

    return () => (
      <>
        <div class={style.toolbar}>
          <el-button onClick={ () => undo() }>撤消</el-button>
          <el-button onClick={ () => redo() }>重做</el-button>
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
      </>
    )
  }
})
