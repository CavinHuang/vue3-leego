import { Module } from 'vuex'
import { RootStateType, CanvasStateType } from '@/store/interface'

const canvas: Module<CanvasStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    canvasStyleData: { // 页面全局数据
      width: 1200,
      height: 740,
      scale: 100
    }
  },
  mutations: {
    SET_CANVAS_STYLE_DATA ({ canvasStyleData }, params) {
      Object.assign(canvasStyleData, params)
    }
  },
  actions: {
    setCanvasStyleData ({ commit }, params) {
      commit('SET_CANVAS_STYLE_DATA', params)
    }
  }
}

export default canvas
