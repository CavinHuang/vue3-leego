import { Module } from 'vuex'
import { RootStateType, SnapshotStateType } from '@/store/interface'
import { deepCopy } from '@/utils'

const canvas: Module<SnapshotStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    snapshotData: [], // 编辑器快照数据
    snapshotIndex: -1 // 快照索引
  },
  mutations: {
    RECORD_SNAPSHOT (state, componentData) {
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = deepCopy(componentData)
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
      }
    }
  },
  actions: {
    recordSnapshot ({ commit, rootState }) {
      commit('RECORD_SNAPSHOT', rootState.canvas.componentData)
    }
  }
}

export default canvas
