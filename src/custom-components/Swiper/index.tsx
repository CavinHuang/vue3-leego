import { defineComponent } from 'vue'
import Swiper from './Swiper'
import SwiperItem from './SwipeItem'

export default defineComponent({
  name: 'customer-swiper',
  setup () {
    return () => (
      <Swiper>
        <SwiperItem>1</SwiperItem>
        <SwiperItem>2</SwiperItem>
        <SwiperItem>3</SwiperItem>
        <SwiperItem>4</SwiperItem>
      </Swiper>
    )
  }
})
