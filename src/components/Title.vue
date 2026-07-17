<script setup>
    import { computed } from 'vue'

    const { infoData } = defineProps(
        {
            infoData: Object
        }
    );

    const headingTag = computed(() => infoData?.tag === 'intro' ? 'h1' : 'h2')
</script>

<template>
    <div :class="['title_area w-full text-left',infoData.tag==='intro' ? 'pb-3 sm:pb-[15px]' : 'pb-0 sm:pb-[0px]']">
        <div :class="['title_box w-fit', (infoData.cmsType==='agenda' || infoData.cmsType==='signUp') ? 'white-title' : '']">
            <component :is="headingTag" class="title" v-html="infoData.title"></component>
        </div>
    </div>
</template>

<style scoped>
   .title_box{
   }

   .title {
        color: #0c3e76;
        text-align: left;
        font-size: 48px;
        line-height: 1.4;
        border-left: 5px solid #0c3e76;
        border-right: 5px solid #0c3e76;
        padding: 0 0.5em;
    }

    .title_box.white-title .title{
        color: #ffffff;
        border-left-color: #ffffff;
        border-right-color: #ffffff;
    }
</style>
