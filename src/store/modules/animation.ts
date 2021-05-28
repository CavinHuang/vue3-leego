import { Module } from 'vuex'
import { RootStateType, AnimationStateType } from '@/store/interface'
import { deepCopy } from '@/utils'

const animation: Module<AnimationStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  mutations: {
  },
  actions: {
    addAnimation ({ commit, rootState }, animation) {
      rootState.canvas.curComponent.animations.push(animation)
      console.log(rootState.canvas.curComponent, animation)
    },
    removeAnimation({ rootState }, index) {
      rootState.canvas.curComponent.animations.splice(index, 1)
    }
  }
}

export default animation
