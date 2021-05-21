import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { RootStateType } from './interface'
import modules from './modules'

export default createStore<RootStateType>({
  mutations: {
  },
  actions: {
  },
  modules
})

// useStore 唯一key
export const key: InjectionKey<Store<RootStateType>> = Symbol('vue-store')

// Store Hook
export function useStore<T = RootStateType> (): Store<T> {
  return baseUseStore<T>(key)
}
// 导出所有的类型
export * from './interface'
