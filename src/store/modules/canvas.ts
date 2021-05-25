import {Module} from 'vuex'
import {CanvasStateType, RootStateType} from '@/store/interface'

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
    updateFrom: 'action', // 标识数据更新来源于那种操作，用于过虑更新表单，避免死循环
    prevCurComponentsStyle: {} // 上一次计算前的当前样式保存
  },
  mutations: {
    GET_EDITOR (state) {
      state.editor = document.querySelector('#editor')
    },
    SET_CANVAS_STYLE_DATA ({ canvasStyleData }, params) {
      Object.assign(canvasStyleData, params)
    },
    ADD_COMPONENTS ({ componentData }, { component, index }) {
      if (index === undefined) {
        componentData.splice(index, 0, component)
      } else {
        componentData.push(component)
      }
      console.log('【组件数据】', componentData)
    },
    SET_CLICK_COMPONENT_STATUS (state, status) {
      state.isClickComponent = status
    },
    SET_CUR_COMPONENT (state, { component, index }) {
      console.log('【设置当前组件激活】', component, index)
      state.curComponent = component
      state.curComponentIndex = index
      state.updateFrom = 'action'
    },
    SET_EDIT_MODE (state, mode) {
      state.editMode = mode
    },
    SET_SHAPE_STYLE ({ curComponent, updateFrom }, { top, left, width, height, rotate }) {
      if (top) curComponent.style.top = top
      if (left) curComponent.style.left = left
      if (width) curComponent.style.width = width
      if (height) curComponent.style.height = height
      if (rotate) curComponent.style.rotate = rotate
      updateFrom = 'action'
    },
    SET_CUR_COMPONENT_STYLE ({ componentData, curComponentIndex, updateFrom, prevCurComponentsStyle }, styles) {
      componentData[curComponentIndex].style = styles
      updateFrom = 'action'
    },
    SET_UPDATE_FORM (state, status) {
      state.updateFrom = status
    }
  },
  actions: {
    setCanvasStyleData ({ commit }, params) {
      commit('SET_CANVAS_STYLE_DATA', params)
    },
    addComponent ({ commit }, { component, index }) {
      commit('ADD_COMPONENTS', { component, index })
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
    setUpdateForm ({ commit }, state) {
      commit('SET_UPDATE_FORM', state)
    }
  }
}

export default canvas
