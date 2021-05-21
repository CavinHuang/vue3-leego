import { App } from 'vue'

const components = [
  'Picture',
  'VText',
  'VButton',
  'Group',
  'RectShape'
]

export const installCustomComponent = (app: App): App => {
  components.forEach(key => {
    app.component(key, () => import(`@/custom-components/${key}`))
  })
  return app
}
