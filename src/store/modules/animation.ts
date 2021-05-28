import { Module } from 'vuex'
import { RootStateType, AnimationStateType } from '@/store/interface'

const animation: Module<AnimationStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  mutations: {
  },
  actions: {
    addAnimation ({ rootState }, animation) {
      if (rootState.canvas.curComponent) {
        rootState.canvas.curComponent.animations.push(animation)
      }
    },
    removeAnimation ({ rootState }, index) {
      if (rootState.canvas.curComponent) {
        rootState.canvas.curComponent.animations.splice(index, 1)
      }
    }
  }
}

export default animation
