let id = 0
// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export default function generateID (): number {
  id = id + 1
  return id
}
