import { defineComponent, ref } from 'vue'
import style from './index.module.scss'

export default defineComponent({
  name: 'form-uploader',
  props: {
    field: {
      type: String,
      default: 'default'
    }
  },
  emits: ['change'],
  setup (props, { emit, attrs }) {
    const imageUrl = ref('')
    const slotDefault = () => {
      return imageUrl.value ? <img src={imageUrl.value} /> : <i class="el-icon-plus avatar-uploader-icon"></i>
    }
    // eslint-disable-next-line
    const beforeUpload = (file: any) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        const res = e.target ? (e.target.result as string) : ''
        emit('change', res)
        imageUrl.value = res
      }
      fileReader.readAsDataURL(file.file as File)
    }
    return () => (
      <div class={style['form-uploader']}>
        <el-upload
          action="#"
          list-type="picture-card"
          auto-upload={true}
          {...attrs}
          http-request={(e: File) => beforeUpload(e)}
          v-slots={
            {
              default: slotDefault
            }
          }
        />
      </div>
    )
  }
})
