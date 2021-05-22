import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestStopEvent',
  setup() {
    const childClick = (e: Event) => {
      console.log('子元素点击', e)
      e.stopPropagation()
      e.preventDefault()
    }
    const parentClick = (e: Event) => {
      console.log('父元素触发', e)
    }
    return () => (
      <div onClick={(e: Event) => parentClick(e)}>
        <button onClick={(e: Event) => childClick(e)}>子按钮</button>
      </div>
    )
  }
})