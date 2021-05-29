/* eslint-disable */
// 为保持和vue2版本中使用bus一致，emit,on,off前面都加了$
export type Handler<T = any> = (...events: Array<T>) => void
class Bus {
  private readonly list: { [key: string]: Array<Handler> }
  constructor () {
    // 收集订阅信息,调度中心
    this.list = {}
  }

  // 订阅
  $on<T = any> (name: string, fn: Handler<T>) {
    this.list[name] = this.list[name] || []
    this.list[name].push(fn)
  }

  // 发布
  $emit<T = any> (name: string, ...evts: Array<T>) {
    if (this.list[name]) {
      this.list[name].forEach((fn) => {
        fn(...evts)
      })
    }
  }

  // 取消订阅
  $off (name: string) {
    if (this.list[name]) {
      delete this.list[name]
    }
  }
}
const eventBus = new Bus()

export default eventBus
