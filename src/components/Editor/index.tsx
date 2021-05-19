import { defineComponent, reactive, computed } from 'vue'
import Grid from './Grid'
import Area from './Area'
import { AreaInfoType, PointType } from './interface'
import { useStore } from '@/store'
import { changeStyleWithScale } from '@/utils/translate'
import style from './index.module.scss'
export default defineComponent({
  name: 'Editor',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const store = useStore()
    const canvasStyleData = computed(() => store.state.canvas.canvasStyleData)

    const start = reactive<PointType>({
      x: 0,
      y: 0
    })

    const areaInfo = reactive<AreaInfoType>({
      width: 0,
      height: 0,
      isShowArea: false
    })

    const handleContextMenu = () => {
      console.log('右键')
    }

    const handleMouseDown = () => {
      console.log('鼠标按下')
    }

    return () => (
      <div
        id="editor"
        class={{ [style.editor]: true, edit: props.isEdit }}
        style={{
          width: changeStyleWithScale(canvasStyleData.value.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.value.height) + 'px'
        }}
        onContextmenu={() => handleContextMenu()}
        onMousedown={() => handleMouseDown()}
      >
        <Grid />
        <Area start={start} width={areaInfo.width} height={areaInfo.height} v-show={areaInfo.isShowArea} />
      </div>
    )
  }
})
