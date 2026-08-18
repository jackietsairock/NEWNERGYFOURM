<script setup>

    import Title from './Title.vue'

    defineProps(
        {
            infoData: Object
        }
    );

</script>

<template>
    <div class="content_wrap z-10">
        <div class="video_box max-w-[1200px] z-20 mx-auto">
            <Title v-if="infoData.title" :infoData="infoData" />
            <div class="video_list">
                <div class="video_item" v-for="(video, index) in infoData.videoInfo" :key="index">
                    <div class="video_frame">
                        <iframe
                            :src="video.src"
                            :title="video.title"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .video_box{
        padding: clamp(2rem, 4.5vw, 4.5rem) clamp(1.25rem, 4.8vw, 3.75rem);
    }

    .video_list{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(1.5rem, 3vw, 2.5rem);
        width: 100%;
        margin: 0 auto;
    }

    .video_item{
        width: 100%;
    }

    .video_frame{
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(8, 35, 75, 0.16);
        background-color: #000;
    }

    .video_frame iframe{
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    @media screen and (max-width: 768px) {
        .video_box{
            padding: 2rem 1rem;
        }

        .video_frame{
            border-radius: 0.5rem;
        }
    }
</style>
