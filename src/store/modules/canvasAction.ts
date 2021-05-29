import { Module } from 'vuex'
import { RootStateType, CanvasActionStateType } from '@/store/interface'
import { deepCopy, swap } from '@/utils'
import { ElMessage } from 'element-plus'
import generateID from '@/utils/generateID'
import decomposeComponent from '@/utils/decomposeComponent'
import { commonStyle, commonAttr } from '@/custom-components/config/sfc'
import eventBus from '@/utils/eventBus'
import { ComponentAttrType } from '@/types/sfc'

const canvas: Module<CanvasActionStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    copyData: null,
    isCut: false
  },
  mutations: {
    COPY (state, { curComponent, curComponentIndex }) {
      if (!curComponent) return
      state.copyData = {
        data: deepCopy(curComponent),
        index: curComponentIndex
      }

      state.isCut = false
      ElMessage.success('复制成功')
    },
    CUT (state) {
      state.isCut = true
    },
    UP_COMPONENT (state, { componentData, curComponentIndex }) {
      // 上移图层 index，表示元素在数组中越往后
      if (curComponentIndex < componentData.length - 1) {
        swap(componentData, curComponentIndex, curComponentIndex + 1)
      } else {
        ElMessage('已经到顶了')
      }
    },
    DOWN_COMPONENT (state, { componentData, curComponentIndex }) {
      // 下移图层 index，表示元素在数组中越往前
      if (curComponentIndex > 0) {
        swap(componentData, curComponentIndex, curComponentIndex - 1)
      } else {
        ElMessage('已经到底了')
      }
    },
    TOP_COMPONENT (state, { componentData, curComponentIndex }) {
      // 置顶
      if (curComponentIndex < componentData.length - 1) {
        swap(componentData, curComponentIndex, componentData.length - 1)
      } else {
        ElMessage('已经到顶了')
      }
    },
    BOTTOM_COMPONENT (state, { componentData, curComponentIndex }) {
      // 置底
      if (curComponentIndex > 0) {
        swap(componentData, curComponentIndex, 0)
      } else {
        ElMessage('已经到底了')
      }
    }
  },
  actions: {
    copy ({ commit, rootState }) {
      commit('COPY', { curComponent: rootState.canvas.curComponent, curComponentIndex: rootState.canvas.curComponentIndex })
    },
    paste ({ state, rootState, dispatch }, isMouse) {
      const { menuTop, menuLeft } = rootState.contextMenu
      if (!state.copyData) {
        ElMessage('请选择组件')
        return
      }

      const data = state.copyData.data

      if (isMouse) {
        data.style.top = menuTop
        data.style.left = menuLeft
      } else {
        data.style.top += 10
        data.style.left += 10
      }

      data.id = generateID()
      dispatch('canvas/addComponent', { component: deepCopy(data) }, { root: true })
      if (state.isCut) {
        state.copyData = null
      }
    },
    cut ({ commit, state, rootState, dispatch }) {
      const { curComponent } = rootState.canvas
      if (!curComponent) {
        ElMessage('请选择组件')
        return
      }

      if (state.copyData) {
        const data = deepCopy(state.copyData.data)
        const index = state.copyData.index
        data.id = generateID()
        dispatch('canvas/addComponent', { component: data, index }, { root: true })
        if (rootState.canvas.curComponentIndex >= index) {
          // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
          rootState.canvas.curComponentIndex++
        }
      }

      dispatch('copy')
      dispatch('canvas/deleteComponent', null, { root: true })
      commit('CUT')
    },
    lock ({ rootState }) {
      if (rootState.canvas.curComponent) {
        rootState.canvas.curComponent.isLock = true
      }
    },
    unlock ({ rootState }) {
      if (rootState.canvas.curComponent) {
        rootState.canvas.curComponent.isLock = false
      }
    },
    hideContextMenu ({ commit }) {
      commit('HIDE_CONTEXT_MENU')
    },
    upComponent ({ commit, rootState }) {
      commit('UP_COMPONENT', rootState.canvas)
    },
    downComponent ({ commit, rootState }) {
      commit('DOWN_COMPONENT', rootState.canvas)
    },
    topComponent ({ commit, rootState }) {
      commit('TOP_COMPONENT', rootState.canvas)
    },
    bottomComponent ({ commit, rootState }) {
      commit('BOTTOM_COMPONENT', rootState.canvas)
    },
    undo ({ rootState, dispatch }) {
      if (rootState.snapshot.snapshotIndex >= 0) {
        rootState.snapshot.snapshotIndex--
        dispatch('canvas/setComponentData', deepCopy(rootState.snapshot.snapshotData[rootState.snapshot.snapshotIndex]), { root: true })
      }
    },
    redo ({ rootState, dispatch }) {
      console.log(rootState.snapshot.snapshotIndex, rootState.snapshot.snapshotData.length)
      if (rootState.snapshot.snapshotIndex < rootState.snapshot.snapshotData.length - 1) {
        rootState.snapshot.snapshotIndex++
        dispatch('canvas/setComponentData', deepCopy(rootState.snapshot.snapshotData[rootState.snapshot.snapshotIndex]), { root: true })
        console.log(rootState.canvas.componentData)
      }
    },
    compose ({ rootState, dispatch }) {
      const { areaData, editor, componentData } = rootState.canvas
      const components: ComponentAttrType[] = []
      areaData.components.forEach(component => {
        if (component.component !== 'Group') {
          components.push(component)
        } else {
          // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
          const parentStyle = { ...component.style }
          const subComponents = component.propValue as ComponentAttrType[]
          if (editor) {
            const editorRect = editor.getBoundingClientRect()

            dispatch('/canvas/deleteComponent', null, { root: true })
            subComponents.forEach((component) => {
              decomposeComponent(component, editorRect, parentStyle)
              dispatch('canvas/addComponent', { component }, { root: true })
            })
            components.push(...subComponents)
            dispatch('canvas/batchDeleteComponent', subComponents, { root: true })
          }
        }
      })
      const curId = generateID()
      dispatch('canvas/addComponent', {
        component: {
          ...commonAttr,
          component: 'Group',
          id: curId,
          style: {
            ...commonStyle,
            ...areaData.style
          },
          propValue: components
        }
      }, { root: true })

      eventBus.$emit<boolean>('hideArea', true)

      dispatch('canvas/batchDeleteComponent', areaData.components, { root: true })
      dispatch('canvas/setCurComponent', {
        component: componentData[componentData.length - 1],
        index: componentData.length - 1
      }, { root: true })
      areaData.components = []
    },
    decompose ({ rootState, dispatch }) {
      const { curComponent, editor } = rootState.canvas
      if (curComponent && editor) {
        const parentStyle = { ...curComponent.style }
        const components = curComponent.propValue as Array<ComponentAttrType>
        const editorRect = editor.getBoundingClientRect()

        dispatch('canvas/deleteComponent', null, { root: true })
        components.forEach((component) => {
          decomposeComponent(component, editorRect, parentStyle)
          dispatch('canvas/addComponent', { component }, { root: true })
        })
      }
    }
  }
}

export default canvas
