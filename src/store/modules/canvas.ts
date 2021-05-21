import { Module } from 'vuex'
import { RootStateType, CanvasStateType } from '@/store/interface'

const canvas: Module<CanvasStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    canvasStyleData: { // 页面全局数据
      width: 1200,
      height: 740,
      scale: 100
    },
    componentData: [] // 画布组件数据
  },
  mutations: {
    SET_CANVAS_STYLE_DATA ({ canvasStyleData }, params) {
      Object.assign(canvasStyleData, params)
    },
    ADD_COMPONENTS ({ componentData }, { component, index }) {
      if (index === void 0) {
        componentData.splice(index, 0, component)
      } else {
        componentData.push(component)
      }
    }
  },
  actions: {
    setCanvasStyleData ({ commit }, params) {
      commit('SET_CANVAS_STYLE_DATA', params)
    },
    addComponent ({ commit }, { component, index }) {
      commit('ADD_COMPONENTS', { component, index })
    }
  }
}

export default canvas
