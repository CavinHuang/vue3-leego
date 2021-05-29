import { defineComponent, ref, computed } from 'vue'
import Model from '../Model'
import { useStore } from '@/store'
import eventBus from '@/utils/eventBus'
import animationClassData from '@/utils/animationClassData'
import style from './index.module.scss'
import { JsonUnknown } from '@/components/FormCreator/interface'
export default defineComponent({
  name: 'AnimationList',
  setup () {
    const store = useStore()
    const isShowAnimation = ref(false)
    const animationActiveName = ref('进入')
    const hoverPreviewAnimate = ref('')
    const curComponent = computed(() => store.state.canvas.curComponent)

    const addAnimation = (animation: JsonUnknown) => {
      store.dispatch('animation/addAnimation', animation)
      isShowAnimation.value = false
    }

    const previewAnimate = () => {
      eventBus.$emit('runAnimation')
    }

    const removeAnimation = (index: number) => {
      store.dispatch('animation/removeAnimation', index)
    }

    return () => (
      <div class={style['animation-list']}>
        <div class="div-animation">
          <el-button onClick={() => {
            isShowAnimation.value = true
          }}>添加动画</el-button>
          <el-button onClick={ () => previewAnimate() }>预览动画</el-button>
          <div>
            { curComponent.value ? curComponent.value.animations.map((tag: JsonUnknown, index: number) => {
              return <el-tag
                closable
                onClose={() => removeAnimation(index)}
              >
                { tag.label }
              </el-tag>
            }) : ''}
          </div>
        </div>

        <Model v-model={isShowAnimation.value}>
          <el-tabs v-model={animationActiveName.value}>
            {animationClassData.map(item => {
              return (
                <el-tab-pane label={item.label} name={item.label}>
                  <el-scrollbar class="animate-container">
                    {item.children.map(animate => {
                      return (
                        <div
                          class="animate"
                          onMouseover={() => (hoverPreviewAnimate.value = animate.value)}
                          onClick={ () => addAnimation(animate)}
                        >
                          <div class={[hoverPreviewAnimate.value === animate.value && animate.value + ' animated']}>
                            { animate.label }
                          </div>
                        </div>
                      )
                    })}
                  </el-scrollbar>
                </el-tab-pane>
              )
            })}
          </el-tabs>
        </Model>
      </div>
    )
  }
})
