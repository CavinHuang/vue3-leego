import { App, defineAsyncComponent } from 'vue'

const components = [
  'Picture',
  'VText',
  'VButton',
  'Group',
  'RectShape'
]

export const installCustomComponent = (app: App): App => {
  components.forEach(key => {
    app.component(key, defineAsyncComponent(() => import(`@/custom-components/${key}`)))
  })
  console.log('========', app)
  return app
}
