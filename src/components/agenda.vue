<script setup>
  import Title from './Title.vue'
  import agendaSideTitle from '../assets/image/T-3.png'

  defineProps({
    infoData: {
      type: Object,
      default: () => ({})
    }
  });
</script>

<template>
  <div class="content_wrap agenda_wrap">
    <img class="agenda_vertical" :src="agendaSideTitle" alt="" aria-hidden="true" />

    <Title :infoData="infoData" />

    <div class="agenda_box">
      <div v-if="infoData.event_info?.length" class="event_info_box">
        <div
          v-for="(item, idx) in infoData.event_info"
          :key="`${item.label}-${idx}`"
          class="event_info_item"
        >
          <p class="event_info_title" v-html="item.title"></p>
          <p v-if="item.detail" class="event_info_detail" v-html="item.detail"></p>
        </div>
      </div>

      <p v-if="infoData.note" class="agenda_note">{{ infoData.note }}</p>

      <div class="agenda_table" role="table" aria-label="論壇議程">
        <div class="agenda_table_head" role="row">
          <div role="columnheader">時間</div>
          <div role="columnheader">議程</div>
        </div>

        <template v-for="(item, idx) in infoData.agendaInfo" :key="`${item.time}-${idx}`">
          <div v-if="item.section" class="agenda_section" role="row">
            <div role="cell">{{ item.section }}</div>
          </div>

          <div class="agenda_table_item" role="row">
            <div class="time_box" role="cell">{{ item.time }}</div>

            <div class="agenda_content" role="cell">
              <div class="topic_box" v-html="item.topic"></div>

              <div
                v-if="item.speaker?.some((speaker) => speaker?.speakerTitle || speaker?.speakerName)"
                class="speaker_area"
              >
                <div
                  v-for="(speaker, speakerIdx) in item.speaker"
                  :key="speakerIdx"
                  v-show="speaker?.speakerTitle || speaker?.speakerName"
                  class="speaker_box"
                >
                  <span v-if="speaker.speakerTitle" class="speaker_title" v-html="speaker.speakerTitle"></span>
                  <strong v-if="speaker.speakerName" class="speaker_name">{{ speaker.speakerName }}</strong>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .agenda_wrap{
    max-width: 1366px;
    padding: 82px 110px 100px 190px;
  }

  .agenda_vertical{
    position: absolute;
    top: 245px;
    left: 54px;
    width: 105px;
    height: auto;
    pointer-events: none;
    user-select: none;
  }

  .agenda_box{
    width: 100%;
    margin: 0 auto;
  }

  .event_info_box{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin: 28px auto 4px;
    text-align: center;
  }

  .event_info_item{
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 9px;
  }

  .event_info_title,
  .event_info_detail{
    margin: 0;
    color: #fff100;
    font-weight: 800;
    line-height: 1.45;
  }

  .event_info_title{
    font-size: clamp(24px, 2.4vw, 34px);
    letter-spacing: 0.03em;
  }

  .event_info_detail{
    font-size: clamp(16px, 1.55vw, 21px);
  }

  .agenda_note{
    margin: 5px 0 24px;
    color: rgba(255, 255, 255, 0.94);
    font-size: 15px;
    letter-spacing: 0.03em;
    text-align: center;
  }

  .agenda_note::before{
    content: '(';
  }

  .agenda_note::after{
    content: ')';
  }

  .agenda_table{
    overflow: hidden;
    padding: 20px 28px 24px;
    border: 1px solid rgba(255, 255, 255, 0.92);
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.99);
    box-shadow: 0 15px 34px rgba(0, 28, 74, 0.25);
  }

  .agenda_table_head,
  .agenda_table_item{
    display: grid;
    grid-template-columns: 22% 78%;
  }

  .agenda_table_head{
    min-height: 44px;
    align-items: center;
    border-bottom: 1px solid #bcc8d2;
    color: #193c5f;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  .agenda_table_head > div,
  .agenda_table_item > div{
    padding: 14px 20px;
  }

  .agenda_table_head > div:first-child,
  .agenda_table_item > div:first-child{
    border-right: 1px solid #e1e6ea;
    text-align: center;
  }

  .agenda_table_item{
    min-height: 76px;
    border-bottom: 1px solid #d8dee4;
    color: #404a53;
  }

  .agenda_table_item:last-child{
    border-bottom: 0;
  }

  .time_box{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    color: #566572;
    font-size: 17px;
    font-weight: 500;
    line-height: 1.55;
  }

  .agenda_content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
  }

  .topic_box{
    color: #263c50;
    font-size: 18px;
    font-weight: 750;
    line-height: 1.55;
  }

  .topic_box :deep(br){
    display: block;
    content: '';
    margin-top: 3px;
  }

  .speaker_area{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .speaker_box{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    font-size: 16px;
    line-height: 1.5;
  }

  .speaker_title{
    color: #59656f;
  }

  .speaker_name{
    color: #00aeca;
    font-weight: 800;
  }

  .agenda_section{
    margin-top: 14px;
    background: linear-gradient(90deg, #22d9c5 0%, #12b8cf 45%, #075ac9 100%);
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-align: center;
  }

  .agenda_section > div{
    padding: 8px 16px;
  }

  @media screen and (max-width: 1024px){
    .agenda_wrap{
      padding: 72px 38px 80px;
    }

    .agenda_vertical{
      display: none;
    }
  }

  @media screen and (max-width: 720px){
    .agenda_wrap{
      padding: 54px 20px 64px;
    }

    .agenda_wrap :deep(.title){
      padding: 0 0.38em;
      font-size: 34px;
      letter-spacing: 3px;
    }

    .event_info_box{
      gap: 8px;
      margin-top: 24px;
    }

    .event_info_item{
      flex-direction: column;
      align-items: center;
      gap: 1px;
    }

    .agenda_note{
      margin-bottom: 18px;
      font-size: 13px;
    }

    .agenda_table{
      padding: 12px 12px 16px;
    }

    .agenda_table_head,
    .agenda_table_item{
      grid-template-columns: 92px 1fr;
    }

    .agenda_table_head > div,
    .agenda_table_item > div{
      padding: 10px 11px;
    }

    .time_box{
      justify-content: flex-start;
      font-size: 14px;
      text-align: left !important;
    }

    .topic_box{
      font-size: 16px;
    }

    .speaker_box{
      font-size: 14px;
    }

    .agenda_section{
      font-size: 16px;
    }
  }

  @media screen and (max-width: 420px){
    .agenda_table_head{
      display: none;
    }

    .agenda_table_item{
      grid-template-columns: 1fr;
      padding: 9px 0;
    }

    .agenda_table_item > div:first-child{
      justify-content: flex-start;
      border-right: 0;
      color: #0874ad;
      font-weight: 800;
    }

    .agenda_content{
      padding-top: 2px !important;
    }
  }
</style>
