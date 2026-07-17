<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Kv from './components/Kv.vue'
import Intro from './components/Intro.vue'
import Speaker from './components/Speaker.vue'
import Agenda from './components/Agenda.vue'
import SignUp from './components/SignUp.vue'
import Traffic from './components/Traffic.vue'
import Event from './components/Event.vue'
import Gototop from './components/Gototop.vue'
import SignUpFiexd from './components/SignUpFiexd.vue'
import Faq from './components/Faq.vue'

import infoData from './assets/json/info.json'
import speakers from './assets/json/speaker.json'
import { createSeoPayload, siteConfig } from './seo/siteSeo'
import { applySeo } from './seo/applySeo'

const seo = createSeoPayload({ infoData, speakers });
applySeo(seo);

const getContentByType = (cmsType, fallbackIndex) => {
  const sections = Array.isArray(infoData.content) ? infoData.content : []
  return sections.find((item) => item.cmsType === cmsType) ?? sections[fallbackIndex] ?? {}
}

const introInfo = getContentByType('intro', 0)
const agendaInfo = getContentByType('agenda', 1)
const speakerInfo = getContentByType('speaker', 2)
const signUpInfo = getContentByType('signUp', 3)
const trafficInfo = getContentByType('traffic', 4)
const eventInfo = getContentByType('event', 5)
const showTrafficSection = false

</script>

<template>
  <Header :menu="infoData.menu" />
  <main id="main-content">
    <section id="kv" class="relative w-full z-20 overflow-hidden" aria-label="2026人資長論壇主視覺">
      <Kv />
    </section>
    <section id="intro" class="relative w-full z-10" aria-label="活動前言">
      <Intro :infoData="introInfo" />
    </section>

    <section id="speaker" class="relative w-full z-10" aria-label="講者陣容">
      <Speaker :speakers="speakers.data" :infoData="speakerInfo"/>

    </section>
    <section id="agenda" class="relative w-full z-20 overflow-hidden" aria-label="活動資訊">
      <Agenda :infoData="agendaInfo" />

    </section>
    <section id="signUp" class="relative w-full z-20 overflow-hidden" aria-label="立即報名">
      <SignUp :infoData="signUpInfo" />

    </section>
    <Faq v-if="siteConfig.showVisibleFaqSection" :faqs="seo.faqs" />
    <section v-if="showTrafficSection" id="traffic" class="relative w-full z-40 overflow-hidden" aria-label="交通資訊">
      <Traffic :infoData="trafficInfo" />

    </section>

    <section id="event" class="relative w-full z-40 overflow-hidden" aria-label="歷屆回顧與合作單位">
      <Event :infoData="eventInfo" />
    </section>
  </main>
  <Footer :footerInfo="infoData.footer" />
  <SignUpFiexd />
  <Gototop />


</template>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#main-content {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f8ff 0%, #eef5ff 40%, #ffffff 100%);
}


#intro{
  padding: 90px 55px;
  background: url('./assets/image/bg3.jpg') center center no-repeat;
  background-size: cover;
  box-shadow: 0 24px 80px rgba(8, 35, 75, 0.08);
}

#speaker{
  background: url('./assets/image/bg4.jpg') center center no-repeat;
  background-size: cover;
  box-shadow: 0 24px 80px rgba(8, 35, 75, 0.08);
}


#agenda{
  background: url('./assets/image/bg2.jpg') center center no-repeat;
  background-size: cover;
  box-shadow: 0 24px 80px rgba(8, 35, 75, 0.08);
}

#signUp{
  background: url('./assets/image/bg2.jpg') center center no-repeat;
  background-size: cover;
  box-shadow: 0 24px 80px rgba(8, 35, 75, 0.08);
}

#gift{
  background-color: #f1f1ef;
}

#traffic{
  background: linear-gradient(to top, #2894e5 0%, #2894e5 100%);
}


@media screen and (max-width: 1024px) {
  .dot_bg{
    background: url('./assets/image/dots-b.png') center center no-repeat;
    background-size: cover;
  }

  .dot_bg.traffic{
    background: url('./assets/image/dots-b.png') center center no-repeat;
    background-size: cover;
    top: none;
    bottom: 0;
    transform: rotate(0);
    height: 200%;
  }
}
</style>
