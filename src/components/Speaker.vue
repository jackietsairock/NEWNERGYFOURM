<script setup>
  import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
  import Title from './Title.vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { A11y, Navigation, Pagination } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'

  const swiperModules = [A11y, Navigation, Pagination]

  // 講者跳窗功能開關：需要重新啟用時改為 true。
  const speakerModalEnabled = false

  const props = defineProps({
    speakers: {
      type: Array,
      default: () => []
    },
    infoData: Object
  })

  const isModalOpen = ref(false)
  const activeSpeaker = ref(null)

  const isExternalUrl = (url = '') => /^(https?:)?\/\//.test(url) || url.startsWith('data:')

  function getImgUrl(img = '') {
    if (!img) {
      return ''
    }

    if (isExternalUrl(img)) {
      return img
    }

    const fileName = img.split('/').filter(Boolean).pop()
    if (!fileName) {
      return ''
    }

    return new URL(`../assets/image/${fileName}`, import.meta.url).href
  }

  const openModal = (speaker) => {
    if (!speakerModalEnabled) {
      return
    }

    activeSpeaker.value = speaker
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    activeSpeaker.value = null
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const lockBodyScroll = (lock) => {
    if (typeof document === 'undefined') {
      return
    }
    document.body.classList.toggle('modal-open', lock)
  }

  watch(isModalOpen, (open) => {
    lockBodyScroll(open)
  })

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    lockBodyScroll(false)
  })

  const normalizeList = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
        .filter((item) => item.length > 0)
    }
    if (typeof value === 'string') {
      const text = value.trim()
      return text.length > 0 ? [text] : []
    }
    return []
  }

  const getSpeakerField = (speaker, fields) => {
    if (!speaker) {
      return null
    }
    const keys = Array.isArray(fields) ? fields : [fields]
    for (const key of keys) {
      const value = speaker[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }
      if (Array.isArray(value) && normalizeList(value).length > 0) {
        return value
      }
    }
    return null
  }

  const normalizeSection = (section) => {
    if (!section || typeof section !== 'object') {
      return null
    }

    const title = typeof section.title === 'string' ? section.title.trim() : ''

    if (typeof section.detail === 'string') {
      const text = section.detail.trim()
      if (!title && !text) {
        return null
      }
      return {
        title,
        mode: 'text',
        text,
        list: []
      }
    }

    const list = normalizeList(section.detail)
    if (!title && list.length === 0) {
      return null
    }

    return {
      title,
      mode: 'list',
      text: '',
      list
    }
  }

  const modalSections = computed(() => {
    const speaker = activeSpeaker.value
    if (!speaker) {
      return []
    }

    const infoSections = Array.isArray(speaker.info)
      ? speaker.info.map((section) => normalizeSection(section)).filter(Boolean)
      : []

    if (infoSections.length > 0) {
      return infoSections
    }

    return [
      { title: '現職', detail: getSpeakerField(speaker, 'job') },
      { title: '學歷', detail: getSpeakerField(speaker, 'education') },
      { title: '經歷', detail: getSpeakerField(speaker, 'experience') },
      { title: '證照', detail: getSpeakerField(speaker, ['Certificate', 'certificate']) },
      { title: '個人簡介', detail: getSpeakerField(speaker, 'description') }
    ]
      .map((section) => normalizeSection(section))
      .filter(Boolean)
  })

  const speakerGroups = computed(() => {
    const groups = []
    for (const speaker of props.speakers || []) {
      const type = speaker.type || '未分類'
      const group = groups.find((entry) => entry.type === type)
      if (group) {
        group.items.push(speaker)
      } else {
        groups.push({ type, items: [speaker] })
      }
    }
    return groups
  });

</script>

<template>
  <div class="content_wrap speaker_wrap">
    <Title :infoData="infoData" />
    <img
      class="speaker_vertical"
      :src="getImgUrl('T-2.png')"
      alt=""
      aria-hidden="true"
    />

    <div v-for="(group, groupIdx) in speakerGroups" :key="group.type" class="speaker_group">
      <Swiper
        class="speaker_swiper"
        :modules="swiperModules"
        :slides-per-view="1.12"
        :space-between="14"
        :watch-overflow="true"
        :navigation="{
          prevEl: `.speaker-prev-${groupIdx}`,
          nextEl: `.speaker-next-${groupIdx}`
        }"
        :pagination="{
          el: `.speaker-pagination-${groupIdx}`,
          clickable: true
        }"
        :breakpoints="{
          560: { slidesPerView: 2, spaceBetween: 18 },
          900: { slidesPerView: 3, spaceBetween: 20 },
          1180: { slidesPerView: 4, spaceBetween: 16 }
        }"
        :aria-label="`${group.type}輪播`"
      >
        <SwiperSlide v-for="(item, itemIdx) in group.items" :key="`${group.type}-${itemIdx}`">
          <article
            :class="['speaker_card', { speaker_card_clickable: speakerModalEnabled }]"
            :role="speakerModalEnabled ? 'button' : undefined"
            :tabindex="speakerModalEnabled ? 0 : undefined"
            :aria-label="speakerModalEnabled ? `查看 ${item.name} 的個人簡介` : undefined"
            @click="openModal(item)"
            @keyup.enter="openModal(item)"
            @keyup.space.prevent="openModal(item)"
          >
            <div class="speaker_img">
              <img :src="getImgUrl(item.img)" :alt="item.name" />
            </div>
            <div class="speaker_card_body">
              <h3 class="speaker_name">{{ item.name }}</h3>
              <br>
              <p v-if="item.name_en" class="speaker_name_en">{{ item.name_en }}</p>
              <div class="speaker_text" v-html="item.title"></div>
              <span v-if="speakerModalEnabled" class="speaker_detail">
                詳細介紹
                <span class="detail_icon" aria-hidden="true">→</span>
              </span>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>

      <div class="speaker_controls" aria-label="輪播控制">
        <button :class="['speaker_arrow', `speaker-prev-${groupIdx}`]" type="button" aria-label="上一組講者">
          <span aria-hidden="true">←</span>
        </button>
        <div :class="['speaker_pagination', `speaker-pagination-${groupIdx}`]"></div>
        <button :class="['speaker_arrow', `speaker-next-${groupIdx}`]" type="button" aria-label="下一組講者">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </div>

  <teleport to="body">
    <transition name="fade">
      <div
        v-if="speakerModalEnabled && isModalOpen && activeSpeaker"
        class="modal_backdrop"
        :style="{ backgroundColor: activeSpeaker.color ? `${activeSpeaker.color}50` : 'rgba(0, 0, 0, 0.2)' }"
        @click.self="closeModal"
      >
        <div class="modal_panel">
          <button class="modal_close z-20" type="button" @click="closeModal" aria-label="關閉視窗">
            ×
          </button>

          <div class="modal_content">
            <div class="modal_image">
              <img :src="getImgUrl(activeSpeaker.img)" :alt="activeSpeaker.name" />
            </div>
            <div class="modal_info">
              <h3 class="modal_name">{{ activeSpeaker.name }}</h3>
              <p class="modal_title" :style="{borderBottom: `5px solid ${activeSpeaker.color}`}" v-html="activeSpeaker.title"></p>

              <div
                v-for="(section, sectionIdx) in modalSections"
                :key="`section-${sectionIdx}`"
                class="modal_section"
              >
                <h4 v-if="section.title">{{ section.title }}</h4>
                <ul v-if="section.mode === 'list' && section.list.length">
                  <li v-for="(detail, detailIdx) in section.list" :key="`detail-${sectionIdx}-${detailIdx}`">
                    {{ detail }}
                  </li>
                </ul>
                <p v-else-if="section.mode === 'text' && section.text" class="modal_description">
                  {{ section.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
    .speaker_wrap{
      max-width: 1420px;
      padding: 82px 54px 76px 180px;
      overflow: hidden;
    }

    .speaker_vertical{
      position: absolute;
      left: 66px;
      top: 238px;
      width: 104px;
      height: auto;
      pointer-events: none;
      user-select: none;
    }

    .speaker_group{
      margin-top: 32px;
    }

    .speaker_swiper{
      overflow: visible;
      padding: 4px 4px 22px;
    }

    .speaker_swiper :deep(.swiper-slide){
      height: auto;
    }

    .speaker_card{
      display: flex;
      height: 100%;
      min-height: 565px;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.95);
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 12px 22px rgba(26, 57, 77, 0.14);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .speaker_card_clickable{
      cursor: pointer;
    }

    .speaker_card_clickable:hover,
    .speaker_card_clickable:focus-visible{
      transform: translateY(-5px);
      box-shadow: 0 18px 30px rgba(26, 57, 77, 0.2);
      outline: none;
    }

    .speaker_card_clickable:focus-visible{
      box-shadow: 0 0 0 3px #2d69a8, 0 18px 30px rgba(26, 57, 77, 0.2);
    }

    .speaker_img{
      display: flex;
      height: 345px;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(230, 239, 241, 0.92) 0%, #fff 82%);
    }

    .speaker_img img{
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
      transition: transform 0.35s ease;
    }

    .speaker_card_clickable:hover .speaker_img img{
      transform: scale(1.025);
    }

    .speaker_card_body{
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      padding: 14px 14px 16px;
      color: #113f78;
    }

    .speaker_name{
      margin: 0;
      color: #073f82;
      font-size: clamp(26px, 2vw, 30px);
      font-weight: 800;
      letter-spacing: 0.06em;
      line-height: 1.2;
    }

    .speaker_name_en{
      min-height: 22px;
      margin: 3px 0 5px;
      color: #56718d;
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
    }

    .speaker_text{
      color: #555;
      font-size: 17px;
      letter-spacing: 0.05em;
      line-height: 1.45;
    }

    .speaker_detail{
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: auto;
      margin-left: auto;
      padding-top: 16px;
      color: #164f8f;
      font-size: 15px;
      letter-spacing: 0.12em;
    }

    .detail_icon{
      display: inline-flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 14px;
      line-height: 1;
    }

    .speaker_controls{
      display: flex;
      min-height: 54px;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin-top: 28px;
    }

    .speaker_arrow{
      display: inline-flex;
      width: 52px;
      height: 52px;
      align-items: center;
      justify-content: center;
      border: 1px solid #2b619a;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.45);
      color: #174d88;
      font-size: 25px;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    }

    .speaker_arrow:hover:not(.swiper-button-disabled){
      background: #174d88;
      color: #fff;
    }

    .speaker_arrow.swiper-button-disabled{
      opacity: 0.35;
      cursor: default;
    }

    .speaker_pagination{
      display: flex;
      width: auto !important;
      align-items: center;
      gap: 9px;
    }

    .speaker_pagination :deep(.swiper-pagination-bullet){
      width: 10px;
      height: 10px;
      margin: 0 !important;
      background: transparent;
      border: 1px solid #2b619a;
      opacity: 1;
    }

    .speaker_pagination :deep(.swiper-pagination-bullet-active){
      background: #104e91;
    }

    .modal_backdrop{
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 2000;
      overflow-y: auto;
      overscroll-behavior: contain;
      min-height: 100vh;
    }

    .modal_panel{
      position: relative;
      background: #fff;
      max-width: 960px;
      width: 100%;
      padding: 48px 56px;
      box-shadow: 0 24px 48px rgba(9, 19, 79, 0.25);
      max-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    @supports (height: 100dvh){
      .modal_backdrop{
        min-height: 100dvh;
      }

      .modal_panel{
        max-height: calc(100dvh - 48px);
      }
    }

    .modal_close{
      position: absolute;
      top: 16px;
      right: 16px;
      border: none;
      background: transparent;
      font-size: 32px;
      cursor: pointer;
      line-height: 1;
      color: #484848;
    }

    .modal_content{
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-right: 12px;
    }

    .modal_image{
      flex-shrink: 0;
      overflow: hidden;
    }

    .modal_image img{
      width: 240px;
      height: auto;
      box-shadow: 0 12px 24px rgba(9, 19, 79, 0.15);
    }

    .modal_info{
      flex: 1;
      color: #484848;
    }

    .modal_name{
      font-size: 32px;
      line-height: 1.2;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .modal_title{
      font-size: 18px;
      color: #7b7b7b;
      margin-bottom: 24px;
      padding-bottom: 24px;
    }

    .modal_section{
      margin-bottom: 24px;
      text-align: left;
    }

    .modal_section h4{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #484848;
    }

    .modal_section ul{
      margin: 0;
      padding-left: 20px;
      list-style: disc;
      color: #2b2c56;
      line-height: 1.8;
    }

    .modal_description{
      font-size: 16px;
      line-height: 1.7;
      color: #2b2c56;
      white-space: pre-line;
      text-align: left;
    }

    .fade-enter-active,
    .fade-leave-active{
      transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to{
      opacity: 0;
    }

    :global(body.modal-open){
      overflow: hidden;
    }

    @media screen and (max-width: 1024px) {
      .speaker_wrap{
        padding: 72px 36px 68px;
      }

      .speaker_vertical{
        display: none;
      }

      .speaker_card{
        min-height: 545px;
      }

      .speaker_img{
        height: 325px;
      }

      .modal_panel{
        padding: 32px 24px;
      }

      .modal_content{
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-right: 0;
      }

      .modal_info{
        width: 100%;
      }

      .modal_section ul{
        padding-left: 0;
        list-style: none;
      }
    }

    @media screen and (max-width: 640px) {
      .speaker_wrap{
        padding: 54px 20px 50px;
      }

      .speaker_wrap :deep(.title){
        padding: 0 0.38em;
        font-size: 34px;
        letter-spacing: 3px;
      }

      .speaker_group{
        margin-top: 24px;
      }

      .speaker_swiper{
        padding-bottom: 16px;
      }

      .speaker_card{
        min-height: 530px;
      }

      .speaker_img{
        height: 320px;
      }

      .speaker_name{
        font-size: 28px;
      }

      .speaker_controls{
        gap: 14px;
        margin-top: 18px;
      }

      .speaker_arrow{
        width: 46px;
        height: 46px;
        font-size: 22px;
      }

      .modal_backdrop{
        align-items: flex-start;
        padding: 16px 12px;
        padding-top: calc(env(safe-area-inset-top) + 16px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
      }

      .modal_image img{
        width: 180px;
      }

      .modal_name{
        font-size: 26px;
      }

      .modal_title{
        font-size: 16px;
      }

      .modal_panel{
        padding: 24px 16px;
        padding-top: calc(env(safe-area-inset-top) + 16px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
        max-height: none;
        height: calc(100vh - 32px);
      }

      @supports (height: 100dvh){
        .modal_panel{
          height: calc(100dvh - 32px);
        }
      }
    }

</style>
