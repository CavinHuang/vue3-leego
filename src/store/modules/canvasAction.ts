import { Module } from 'vuex'
import { RootStateType, CanvasActionStateType } from '@/store/interface'
import { deepCopy, swap } from '@/utils'
import { ElMessage } from 'element-plus'
import generateID from '@/utils/generateID'
import { useStore } from '@/store'

const store = useStore()

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
        index: curComponentIndex,
      }

      state.isCut = false
    },
    PASTE (state, { isMouse, menuTop, menuLeft }) {
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
      store.dispatch('canvas/addComponent', { component: deepCopy(data) })
      if (state.isCut) {
        state.copyData = null
      }
    },
    CUT (state, rootState) {
      if (!rootState.curComponent) {
        ElMessage('请选择组件')
        return
      }

      if (state.copyData) {
        const data = deepCopy(state.copyData.data)
        const index = state.copyData.index
        data.id = generateID()
        store.commit('addComponent', { component: data, index })
        if (rootState.curComponentIndex >= index) {
          // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
          rootState.curComponentIndex++
        }
      }

      store.commit('copy')
      store.commit('deleteComponent')
      state.isCut = true
    },
    LOCK (state, rootState) {
      rootState.curComponent.isLock = true
    },
    UNLOCK (state, rootState ) {
      rootState.curComponent.isLock = false
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
    paste ({ commit, rootState }, isMouse) {
      commit('PASTE', { isMouse, menuTop: rootState.contextMenu.menuTop, menuLeft: rootState.contextMenu.menuLeft })
    },
    cut ({ commit, rootState }) {
      commit('CUT', rootState)
    },
    LOCK ({ commit, rootState }) {
      commit('CUT', rootState)
    },
    UNLOCK ({ commit, rootState }) {
      commit('CUT', rootState)
    },
    hideContextMenu ({ commit }) {
      commit('HIDE_CONTEXT_MENU')
    },
    upComponent ({ commit, rootState }) {
      commit('UP_COMPONENT', rootState)
    },
    downComponent ({ commit, rootState }) {
      commit('DOWN_COMPONENT', rootState)
    },
    topComponent ({ commit, rootState }) {
      commit('TOP_COMPONENT', rootState)
    },
    bottomComponent ({ commit, rootState }) {
      commit('BOTTOM_COMPONENT', rootState)
    }
  }
}

export default canvas
