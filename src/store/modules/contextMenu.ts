import { Module } from 'vuex'
import { RootStateType, ContextMenuStateType } from '@/store/interface'
import { deepCopy } from '@/utils'

const canvas: Module<ContextMenuStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    menuTop: 0, // 右击菜单数据
    menuLeft: 0,
    menuShow: false,
  },
  mutations: {
    SHOW_CONTEXT_MENU (state, { top, left }) {
      state.menuShow = true
      state.menuTop = top
      state.menuLeft = left
    },

    HIDE_CONTEXT_MENU (state) {
      state.menuShow = false
    }
  },
  actions: {
    showContextMenu ({ commit }, { top, left }) {
      commit('SHOW_CONTEXT_MENU', { top, left })
    },
    hideContextMenu ({ commit }) {
      commit('HIDE_CONTEXT_MENU')
    }
  }
}

export default canvas
