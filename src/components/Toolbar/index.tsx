import { defineComponent } from 'vue'
import { useStore, CanvasStyleType } from '@/store'

import style from './index.module.scss'

export default defineComponent({
  name: 'Toolbar',
  setup () {
    const store = useStore()
    const canvasStyleData = store.state.canvas.canvasStyleData

    // 修改画布样式数据
    const canvasStyleChangeHandler = (field: keyof CanvasStyleType, e: Event): void => {
      const inputTarget = e.target as HTMLInputElement
      store.dispatch('canvas/setCanvasStyleData', { [field]: Number(inputTarget.value) })
    }

    const handleFileChange = (e: Event): void => {
      console.log(e)
    }

    return () => (
      <>
        <div class={style.toolbar}>
          <el-button onclick="undo">撤消</el-button>
          <el-button onclick="redo">重做</el-button>
          <label for="input" class="insert">插入图片</label>
          <input type="file" onChange={(e: Event) => handleFileChange(e)} id="input" hidden />
          <el-button onclick="preview" style="margin-left: 10px;">预览</el-button>
          <el-button onclick="save">保存</el-button>
          <el-button onclick="clearCanvas">清空画布</el-button>
          <el-button onclick="compose">组合</el-button>
          <el-button onclick="decompose">拆分</el-button>
          <el-button onclick="lock">锁定</el-button>
          <el-button onclick="unlock">解锁</el-button>
          <div class="canvas-config">
            <span>画布大小</span>
            <input value={ canvasStyleData.width } onInput={ (e: Event) => canvasStyleChangeHandler('width', e) } />
            <span>*</span>
            <input value={ canvasStyleData.height } onClick={ (e: Event) => canvasStyleChangeHandler('height', e) } />
          </div>
          <div class="canvas-config">
            <span>画布比例</span>
            <input value={ canvasStyleData.scale } onInput={(e: Event) => canvasStyleChangeHandler('scale', e)} /> %
          </div>
        </div>
      </>
    )
  }
})
