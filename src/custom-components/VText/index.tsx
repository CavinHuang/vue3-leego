import { defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import { keycodes } from '@/utils/shortcutKey'

export default defineComponent({
  props: {
    propValue: {
      type: String,
      require: true,
    },
    element: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const store = useStore()
    const canEdit = ref(false)
    const ctrlKey = 17
    const isCtrlDown = ref(false)
    const editMode = store.state.canvas.editMode
    const textRef = ref<HTMLDivElement>()

    const handleInput = (e: Event) =>{
      emit('input', props.element, (e.target as HTMLInputElement).innerHTML)
    }
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.keyCode === ctrlKey) {
        isCtrlDown.value = true
      } else if (isCtrlDown.value && canEdit.value && keycodes.includes(e.keyCode)) {
        e.stopPropagation()
      } else if (e.keyCode == 46) { // deleteKey
        e.stopPropagation()
      }
    }
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.keyCode == ctrlKey) {
        isCtrlDown.value = false
      }
    }

    const handleMousedown = (e: MouseEvent) =>{
      if (canEdit.value) {
        e.stopPropagation()
      }
    }

    const clearStyle = (e: any) => {
      e.preventDefault()
      const clp = e.clipboardData
      const text = clp.getData('text/plain') || ''
      if (text !== '') {
        document.execCommand('insertText', false, text)
      }

      emit('input', props.element, e.target.innerHTML)
    }

    const handleBlur = (e: any) =>{
      props.element.propValue = e.target.innerHTML || '&nbsp;'
      canEdit.value = false
    }

    const setEdit = () => {
      canEdit.value = true
      // 全选
      selectText((textRef.value as any).text)
    }

   const selectText = (element: any) => {
      const selection: any = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(element)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    return () => (
        editMode === 'edit' ?
        <div class="v-text" onKeydown={(e: KeyboardEvent) => handleKeydown(e)} onKeyup={(e: KeyboardEvent) => handleKeyup(e)}>
          {/**<!-- tabindex >= 0 使得双击时聚集该元素 -->**/}
          <div contenteditable={canEdit.value} class="{ canEdit }" onDblclick={() => setEdit()} tabindex={props.element.id} onPaste={clearStyle} onMousedown={handleMousedown} onBlur={handleBlur} ref={textRef} v-html="element.propValue" onInput={(e: Event) => handleInput(e)} style={{ verticalAlign: props.element.style.verticalAlign }} />
        </div>
        :
        <div v-else class="v-text preview">
          <div v-html="element.propValue" style="{ verticalAlign: element.style.verticalAlign }" />
        </div>
    )
  }
})
