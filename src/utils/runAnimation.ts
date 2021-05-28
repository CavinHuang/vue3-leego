import { JsonUnknown } from '@/components/FormCreator/interface'

export default async function runAnimation ($el: HTMLElement, animations: JsonUnknown[] = []): Promise<void> {
  const play = (animation: JsonUnknown) => new Promise(resolve => {
    $el.classList.add(animation.value, 'animated')
    const removeAnimation = () => {
      $el.removeEventListener('animationend', removeAnimation)
      $el.removeEventListener('animationcancel', removeAnimation)
      $el.classList.remove(animation.value, 'animated')
      resolve(true)
    }

    $el.addEventListener('animationend', removeAnimation)
    $el.addEventListener('animationcancel', removeAnimation)
  })

  for (let i = 0, len = animations.length; i < len; i++) {
    await play(animations[i])
  }
}
