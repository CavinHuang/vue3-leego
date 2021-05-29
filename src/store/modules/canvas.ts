import { Module } from 'vuex'
import { CanvasStateType, RootStateType } from '@/store/interface'
import { ComponentAttrType, SfcStyleKey } from '@/types/sfc'

const canvas: Module<CanvasStateType, RootStateType> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    canvasStyleData: { // 页面全局数据
      width: 1200,
      height: 740,
      scale: 100
    },
    componentData: [], // 画布组件数据
    curComponent: null,
    curComponentIndex: -1,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
    editor: null,
    editMode: 'edit', // 编辑器模式 edit preview
    prevCurComponentsStyle: {}, // 上一次计算前的当前样式保存
    areaData: { // 选中区域包含的组件以及区域位移信息
      style: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      components: []
    }
  },
  mutations: {
    GET_EDITOR (state) {
      state.editor = document.querySelector('#editor')
    },
    SET_CANVAS_STYLE_DATA ({ canvasStyleData }, params) {
      Object.assign(canvasStyleData, params)
    },
    SET_COMPONENT_DATA (state, componentData = []) {
      state.componentData = componentData
    },
    ADD_COMPONENTS ({ componentData }, { component, index }) {
      if (index === undefined) {
        componentData.splice(index, 0, component)
      } else {
        componentData.push(component)
      }
      console.log('【组件数据】', componentData)
    },
    DELETE_COMPONENT (state, index) {
      if (index === undefined) {
        index = state.curComponentIndex
      }

      if (index === state.curComponentIndex) {
        state.curComponentIndex = -1
        state.curComponent = null
      }

      state.componentData.splice(index, 1)
    },
    // 将已经放到 Group 组件数据删除，也就是在 componentData 中删除，因为它们已经放到 Group 组件中了
    BATCH_DELTE_COMPONENT ({ componentData }, deleteData: ComponentAttrType[]) {
      deleteData.forEach(component => {
        for (let i = 0, len = componentData.length; i < len; i++) {
          if (component.id === componentData[i].id) {
            componentData.splice(i, 1)
            break
          }
        }
      })
    },
    SET_CLICK_COMPONENT_STATUS (state, status) {
      state.isClickComponent = status
    },
    SET_CUR_COMPONENT (state, { component, index }) {
      console.log('【设置当前组件激活】', component, index)
      state.curComponent = component
      state.curComponentIndex = index
    },
    SET_EDIT_MODE (state, mode) {
      state.editMode = mode
    },
    SET_SHAPE_STYLE ({ curComponent }, { top, left, width, height, rotate }) {
      if (curComponent) {
        if (top) curComponent.style.top = top
        if (left) curComponent.style.left = left
        if (width) curComponent.style.width = width
        if (height) curComponent.style.height = height
        if (rotate) curComponent.style.rotate = rotate
      }
    },
    SET_CUR_COMPONENT_STYLE ({ componentData, curComponentIndex }, styles) {
      componentData[curComponentIndex].style = styles
    },
    SET_SHAPE_SINGLE_STYLE ({ curComponent }, styleItem) {
      if (curComponent) {
        const key = styleItem.key as SfcStyleKey
        const value = styleItem.value
        if (curComponent.style[key]) {
          curComponent.style[key] = value
        }
      }
    },
    SET_AREA_DATA (state, data) {
      state.areaData = data
    }
  },
  actions: {
    setCanvasStyleData ({ commit }, params) {
      commit('SET_CANVAS_STYLE_DATA', params)
    },
    addComponent ({ commit }, { component, index }) {
      commit('ADD_COMPONENTS', { component, index })
    },
    setComponentData ({ commit }, data) {
      commit('SET_COMPONENT_DATA', data)
    },
    deleteComponent ({ commit }, index) {
      commit('DELETE_COMPONENT', index)
    },
    batchDeleteComponent ({ commit }, deleteData) {
      commit('BATCH_DELTE_COMPONENT', deleteData)
    },
    setClickComponentStatus ({ commit }, status) {
      commit('SET_CLICK_COMPONENT_STATUS', status)
    },
    setCurComponent ({ commit }, { component, index }) {
      commit('SET_CUR_COMPONENT', { component, index })
    },
    getEditor ({ commit }) {
      commit('GET_EDITOR')
    },
    setEditMode ({ commit }, mode) {
      commit('SET_EDIT_MODE', mode)
    },
    setShapeStyle ({ commit }, { top, left, width, height, rotate }) {
      commit('SET_SHAPE_STYLE', { top, left, width, height, rotate })
    },
    setCusComponentStyle ({ commit }, styles) {
      commit('SET_CUR_COMPONENT_STYLE', styles)
    },
    setShapeSingleStyle ({ commit }, styleItem) {
      const key = styleItem.key as SfcStyleKey
      const value = styleItem.value as string
      commit('SET_SHAPE_SINGLE_STYLE', { key, value })
    },
    setAreaData ({ commit }, data) {
      commit('SET_AREA_DATA', data)
    }
  }
}

export default canvas
