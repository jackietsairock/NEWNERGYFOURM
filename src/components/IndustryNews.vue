<script setup>
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import Title from './Title.vue'
import newsSideTitle from '../assets/image/T-5.png'

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({})
  }
})

const swiperModules = [A11y, Navigation, Pagination]
const newsItems = computed(() => Array.isArray(props.infoData?.items) ? props.infoData.items : [])

const isExternalUrl = (url = '') => /^(https?:)?\/\//.test(url) || url.startsWith('data:')

const getImageUrl = (imagePath = '') => {
  if (!imagePath) return ''
  if (isExternalUrl(imagePath)) return imagePath

  const fileName = imagePath.split('/').filter(Boolean).pop()
  return fileName ? new URL(`../assets/image/${fileName}`, import.meta.url).href : ''
}
</script>

<template>
  <div class="content_wrap news_wrap">
    <img class="news_vertical" :src="newsSideTitle" alt="" aria-hidden="true" />
    <Title :infoData="infoData" />

    <div class="news_slider_wrap">
      <Swiper
        class="news_swiper"
        :modules="swiperModules"
        :slides-per-view="1.08"
        :space-between="16"
        :watch-overflow="true"
        :navigation="{
          prevEl: '.news_prev',
          nextEl: '.news_next'
        }"
        :pagination="{
          el: '.news_pagination',
          clickable: true
        }"
        :breakpoints="{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 }
        }"
        aria-label="產業動態輪播"
      >
        <SwiperSlide v-for="(item, idx) in newsItems" :key="`${item.title}-${idx}`">
          <article class="news_card">
            <a
              v-if="item.href"
              class="news_card_link"
              :href="item.href"
              :target="item.target || '_blank'"
              :rel="(item.target || '_blank') === '_blank' ? 'noopener noreferrer' : undefined"
              :aria-label="`閱讀產業動態：${item.title}`"
            >
              <div class="news_image_box">
                <img :src="getImageUrl(item.img)" :alt="item.alt || item.title" />
              </div>
              <div class="news_card_body">
                <p v-if="item.category" class="news_category">{{ item.category }}</p>
                <h3>{{ item.title }}</h3>
                <p v-if="item.summary" class="news_summary">{{ item.summary }}</p>
                <span class="news_more">詳細內容 <span aria-hidden="true">→</span></span>
              </div>
            </a>

            <div v-else class="news_card_link">
              <div class="news_image_box">
                <img :src="getImageUrl(item.img)" :alt="item.alt || item.title" />
              </div>
              <div class="news_card_body">
                <p v-if="item.category" class="news_category">{{ item.category }}</p>
                <h3>{{ item.title }}</h3>
                <p v-if="item.summary" class="news_summary">{{ item.summary }}</p>
              </div>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>

      <div class="news_controls" aria-label="產業動態輪播控制">
        <button class="news_arrow news_prev" type="button" aria-label="上一組產業動態">
          <span aria-hidden="true">←</span>
        </button>
        <div class="news_pagination"></div>
        <button class="news_arrow news_next" type="button" aria-label="下一組產業動態">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.news_wrap{
  max-width: 1366px;
  padding: 82px 70px 82px 190px;
  overflow: hidden;
}

.news_vertical{
  position: absolute;
  top: 225px;
  left: 58px;
  width: 102px;
  height: auto;
  pointer-events: none;
  user-select: none;
}

.news_slider_wrap{
  margin-top: 32px;
}

.news_swiper{
  overflow: visible;
  padding: 4px 4px 20px;
}

.news_swiper :deep(.swiper-slide){
  height: auto;
}

.news_card{
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(218, 228, 234, 0.9);
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(36, 67, 84, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.news_card:hover{
  transform: translateY(-5px);
  box-shadow: 0 17px 29px rgba(36, 67, 84, 0.18);
}

.news_card_link{
  display: flex;
  height: 100%;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
}

.news_image_box{
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #dce9ee;
}

.news_image_box img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.news_card:hover .news_image_box img{
  transform: scale(1.035);
}

.news_card_body{
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 17px 18px 16px;
}

.news_category{
  margin: 0 0 7px;
  color: #1688a4;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.news_card h3{
  margin: 0;
  color: #17456f;
  font-size: 19px;
  font-weight: 750;
  line-height: 1.5;
}

.news_summary{
  display: -webkit-box;
  overflow: hidden;
  margin: 9px 0 0;
  color: #606b73;
  font-size: 14px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news_more{
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  margin-left: auto;
  padding-top: 15px;
  color: #155c9d;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.news_controls{
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 15px;
}

.news_arrow{
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: 1px solid #28639b;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  color: #174f88;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.news_arrow:hover:not(.swiper-button-disabled){
  background: #174f88;
  color: #fff;
}

.news_arrow.swiper-button-disabled{
  opacity: 0.35;
  cursor: default;
}

.news_pagination{
  display: flex;
  width: auto !important;
  align-items: center;
  gap: 8px;
}

.news_pagination :deep(.swiper-pagination-bullet){
  width: 9px;
  height: 9px;
  margin: 0 !important;
  border: 1px solid #28639b;
  background: transparent;
  opacity: 1;
}

.news_pagination :deep(.swiper-pagination-bullet-active){
  background: #155c9d;
}

@media screen and (max-width: 1024px){
  .news_wrap{
    padding: 72px 38px 70px;
  }

  .news_vertical{
    display: none;
  }
}

@media screen and (max-width: 640px){
  .news_wrap{
    padding: 54px 20px 54px;
  }

  .news_wrap :deep(.title){
    padding: 0 0.38em;
    font-size: 34px;
    letter-spacing: 3px;
  }

  .news_slider_wrap{
    margin-top: 24px;
  }

  .news_card h3{
    font-size: 18px;
  }
}
</style>
