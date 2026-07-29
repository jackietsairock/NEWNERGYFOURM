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
        <div class="intro_box max-w-[1200px] z-20 mx-auto">
            <Title :infoData="infoData" />
            <div class="intro_text">
                <p class="intro_text__body" v-html="infoData.text[0]"></p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .intro_box{
        padding: clamp(2rem, 4.5vw, 4.5rem) clamp(1.25rem, 4.8vw, 3.75rem);
    }

    .intro_text{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(1.5rem, 3vw, 2.5rem);
        text-align: center;
        width: 100%;
        margin: 0 auto;
    }

    .intro_text::before {
        content: '';
        position: absolute;
        left: -150px;
        top: 0;
        width: 120px;
        height: 100%;
        background-image: url('../assets/image/t-1.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center top;
    }

    /*
    .intro_text__headline{
        position: relative;
        width: min(100%, 1080px);
        margin: 0;
        padding: clamp(0.7rem, 1.35vw, 1rem) clamp(1rem, 3.5vw, 2.75rem);
        color: #2fa7e3;
        font-size: clamp(1.25rem, 2.1vw, 2rem);
        font-weight: 800;
        line-height: 1.45;
        letter-spacing: 0.06em;
    }

    .intro_text__headline::before{
        content: "";
        position: absolute;
        inset: 0;
        border: 2px solid #2fa7e3;
        transform: skewX(-12deg);
        transform-origin: center;
        pointer-events: none;
    }
    */

    .intro_text__body{
        margin: 0;
        color: #4a4a4a;
        font-size: clamp(1.125rem, 1.55vw, 1.5rem);
        font-weight: 400;
        line-height: 1.95;
        letter-spacing: 0.05em;
        text-align: left;
    }

    .intro_text__body :deep(br){
        display: block;
    }

    @media screen and (max-width: 1200px) {
        // .intro_text__body :deep(br){
        //     display: none;
        // }
    }

    @media screen and (max-width: 768px) {
        .intro_box{
            padding: 2rem 1rem;
            border-radius: 1rem;
        }

        .intro_text{
            gap: 1.25rem;
        }

        .intro_text__body{
            font-size: 1rem;
            text-align: justify;
            line-height: 1.8;
            letter-spacing: 0.03em;
        }

        .intro_text::before {
            display: none;
        }
    }
</style>
