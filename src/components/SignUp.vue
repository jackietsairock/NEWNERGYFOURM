<script setup>
import { computed, ref, watch } from 'vue'

import Title from './Title.vue'
import signUpSideTitle from '../assets/image/T-4.png'

const props = defineProps({
    infoData: Object
})

const OTHER_SENTINEL = '__OTHER__'

const form = ref({})
const otherInputs = ref({})
const termsAnchor = ref(null)

const visibleLabels = computed(() =>
    (props.infoData?.label ?? []).filter((item) => item.show !== false)
)
const personalInfo = computed(() => props.infoData?.personal_info ?? {})
const hasPersonalInfo = computed(() => Boolean(props.infoData?.personal_info))
const showPersonalInfo = computed(() => hasPersonalInfo.value && personalInfo.value.show !== false)
const agreeInputName = computed(() => personalInfo.value.inputName || 'Agree')

const mobileRegex = /^09\d{8}$/
const emailRegex = /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
const nameRegex = /^.{2,30}$/

function createInitialFormState(infoData) {
    // 依照 info.json 的欄位設定建立表單初始值。
    const nextForm = {}

    for (const field of infoData?.label ?? []) {
        if (!field?.inputName) continue

        if (field.type === 'checkbox') {
            nextForm[field.inputName] = (field.label ?? [])
                .filter((option) => option.checked)
                .map((option) => (option.labelName === '其他' ? OTHER_SENTINEL : option.value))
            continue
        }

        if (field.type === 'select') {
            const defaultOption = (field.option ?? []).find((option) => option.checked) ?? field.option?.[0]
            nextForm[field.inputName] = defaultOption?.value ?? ''
            continue
        }

        nextForm[field.inputName] = field.value ?? ''
    }

    if (infoData?.personal_info) {
        const agreeKey = infoData.personal_info.inputName || 'Agree'
        nextForm[agreeKey] = Boolean(infoData.personal_info.checked)
    }

    return nextForm
}

function createInitialOtherInputs(infoData) {
    // 建立「其他」欄位要使用的文字輸入初始值。
    const nextOtherInputs = {}

    for (const field of infoData?.label ?? []) {
        const hasOtherCheckbox = field.type === 'checkbox' && (field.label ?? []).some((option) => option.labelName === '其他')
        const hasOtherSelect = field.type === 'select' && (field.option ?? []).some((option) => option.value === '其他')

        if (hasOtherCheckbox || hasOtherSelect) {
            nextOtherInputs[field.inputName] = ''
        }
    }

    return nextOtherInputs
}

watch(
    () => props.infoData,
    (nextInfoData) => {
        form.value = createInitialFormState(nextInfoData)
        otherInputs.value = createInitialOtherInputs(nextInfoData)
    },
    { immediate: true }
)

function checkVal() {
    // 送出前依照 info.json 的 required 與欄位格式逐一驗證。
    for (const field of visibleLabels.value) {
        const value = form.value[field.inputName]

        if (field.required && isEmpty(value)) {
            alert(getRequiredMessage(field))
            return
        }

        const formatMessage = getFormatMessage(field, value)
        if (formatMessage) {
            alert(formatMessage)
            return
        }

        if (isOtherSelected(field.inputName) && !getOtherValue(field.inputName)) {
            alert(`請填寫其他${field.tagName}`)
            return
        }
    }

    if (showPersonalInfo.value && personalInfo.value.required && !form.value[agreeInputName.value]) {
        alert(`請勾選${personalInfo.value.tagName || '同意個資蒐集'}`)
        return
    }

    sign_up()
}

function scrollToTerms() {
    // 點擊「個資條款」時，捲動到個資聲明區塊。
    const el = termsAnchor.value
    if (!el) return

    const header = document.querySelector('header')
    const headerHeight = header ? header.getBoundingClientRect().height : 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12

    window.scrollTo({ top, behavior: 'smooth' })
}

function sign_up() {
    // 將表單資料整理成 FormData，送到報名 API。
    const data = new FormData()
    // const url = 'http://events-kenny.businesstoday.com.tw/backend/SDGsforum2026/sign_up?v=' + new Date().getTime()
    const url = 'https://events.businesstoday.com.tw/backend/newenergyforum2026/sign_up?v=' + new Date().getTime()

    for (const key in form.value) {
        const value = form.value[key]

        // 個資同意僅供前端必填驗證，不傳送至報名 API。
        if (key === agreeInputName.value) {
            continue
        }

        if (Array.isArray(value)) {
            const normalized = value
                .map((item) => (item === OTHER_SENTINEL ? getOtherValue(key) : item))
                .filter((item) => item)

            data.append(key, normalized.join(','))
        } else {
            const normalized = value === '其他' ? (getOtherValue(key) || value) : value
            data.append(key, normalized)
        }
    }

    fetch(url, {
        method: 'POST',
        body: data
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.bIsSignUpSuccess === 0) {
                alert(response.sError)
            } else {
                alert('感謝您的支持，我們已收到您的報名資訊。本活動採審核制，我們將於活動前一周以簡訊發送【報名結果通知】，活動當日憑簡訊【報到序號】入場，敬請留意手機簡訊。')
                location.href = './index.html'
            }
        })
        .catch(() => {
            alert('系統忙碌中，請稍後再試！')
        })
}

function getOtherValue(key) {
    // 取得指定欄位中「其他」文字輸入的內容。
    return String(otherInputs.value[key] || '').trim()
}

function isEmpty(value) {
    // 判斷欄位值是否為空，支援一般文字與 checkbox 陣列。
    if (Array.isArray(value)) return value.length === 0
    return !String(value ?? '').trim()
}

function isRequiredField(field) {
    // 判斷欄位是否在 info.json 設定為必填。
    return field.required === true
}

function getRequiredMessage(field) {
    // 依欄位類型產生必填未填時的提示文字。
    const action = field.type === 'select' || field.type === 'checkbox' ? '選擇' : '輸入'
    return `請${action}${field.tagName}`
}

function getFormatMessage(field, value) {
    // 檢查姓名、手機、Email 等欄位格式，錯誤時回傳提示文字。
    const text = String(value ?? '').trim()
    if (!text) return ''

    if (field.inputName === 'Name' && !nameRegex.test(text)) {
        return '姓名長度請輸入2~30字'
    }

    if (field.inputName === 'Cell_phone' && !mobileRegex.test(text)) {
        return '手機請輸入09開頭之連續10碼數字'
    }

    if (field.inputName === 'Email' && !emailRegex.test(text)) {
        return '請填寫正確Email'
    }

    return ''
}

function getInputType(field) {
    // 依欄位名稱轉成合適的 HTML input type。
    if (field.inputName === 'Email') return 'email'
    if (field.inputName === 'Cell_phone') return 'tel'
    if (field.type === 'number') return 'number'
    return 'text'
}

function getMaxLength(field) {
    // 回傳欄位可輸入的最大長度，目前手機限制為 10 碼。
    return field.inputName === 'Cell_phone' ? 10 : undefined
}

function isOtherSelected(key) {
    // 判斷指定欄位是否有選到「其他」選項。
    const value = form.value[key]

    if (Array.isArray(value)) {
        return value.includes(OTHER_SENTINEL)
    }

    return value === '其他'
}
</script>

<template>
    <div class="content_wrap signup_wrap">
        <img class="signup_vertical" :src="signUpSideTitle" alt="" aria-hidden="true" />
        <Title :infoData="props.infoData" />
        <div class="signUp_box">
            <!--<p class="text-center text-white font-bold text-5xl sm:text-9xl" style="letter-spacing: 3px;">SIGN UP</p>-->
            <form class="signup_form" @submit.prevent="checkVal">
                <!-- <div class="sign_up_info_box flex flex-col gap-8 my-10 mx-auto text-center text-[#4e4e5a]">
                    <div v-for="(item, idx) in props.infoData.signUp_info" :key="idx" class="sign_up_info_item flex flex-col items-center gap-4 text-justify sm:text-center">
                        <div class="label_box bg-[#f5c82d] w-fit px-6 py-2 rounded-4xl">
                            <p class="text-base text-[#4e4e5a] font-bold sm:text-lg">{{ item.label }}</p>
                        </div>
                        <p class="text-base leading-relaxed sm:text-lg" v-html="item.detail"></p>
                    </div>
                    <div class="border-t border-dashed border-gray-300 pt-2"></div>
                </div> -->
                <div v-for="(item, idx) in visibleLabels" :key="idx" class="form_row">
                    <label class="form_label"><span v-if="isRequiredField(item)" class="required_mark">*</span>{{ item.tagName }}</label>

                    <input
                        v-if="item.type !== 'select' && item.type !== 'checkbox'"
                        v-model="form[item.inputName]"
                        :name="item.inputName"
                        :type="getInputType(item)"
                        :min="item.type === 'number' ? 0 : undefined"
                        :maxlength="getMaxLength(item)"
                        class="form_control"
                    />
                    <div v-else-if="item.type === 'checkbox'" class="option_list">
                        <label v-for="(opt, oidx) in item.label" :key="oidx" class="option_item">
                            <input
                                v-model="form[item.inputName]"
                                type="checkbox"
                                :name="item.inputName"
                                :value="opt.labelName === '其他' ? OTHER_SENTINEL : opt.value"
                                class="option_checkbox"
                            />
                            <span>{{ opt.labelName }}</span>
                            <input
                                v-if="opt.labelName === '其他'"
                                v-model="otherInputs[item.inputName]"
                                type="text"
                                :disabled="!isOtherSelected(item.inputName)"
                                class="form_other_input"
                                :placeholder="`請輸入${item.tagName}`"
                            />
                        </label>
                    </div>
                    <div v-else class="select_group">
                        <select v-model="form[item.inputName]" :name="item.inputName" class="form_control">
                            <option v-for="(opt, idx) in item.option" :key="idx" :value="opt.value">{{ opt.optionName }}</option>
                        </select>
                        <input
                            v-if="isOtherSelected(item.inputName)"
                            v-model="otherInputs[item.inputName]"
                            type="text"
                            class="form_control"
                            :placeholder="`請輸入${item.tagName}`"
                        />
                    </div>
                </div>
                <div v-if="showPersonalInfo && (personalInfo.title || personalInfo.detail)" id="agree-terms" ref="termsAnchor" class="privacy_box">
                    <p v-if="personalInfo.title" class="privacy_title">{{ personalInfo.title }}</p>
                    <p v-if="personalInfo.detail" class="privacy_detail" v-html="personalInfo.detail"></p>
                </div>
                <div v-if="showPersonalInfo" class="agree_box">
                    <input v-model="form[agreeInputName]" type="checkbox" id="agree" :name="agreeInputName" />
                    <label for="agree">
                        我已閱讀<a href="#agree-terms" class="personal_information_terms_text" @click.stop.prevent="scrollToTerms">個資條款</a>且同意送出資料
                    </label>
                </div>
                <button type="submit" class="submit_button">
                    <img src="../assets/image/signup2.png" alt="送出報名">
                </button>
                <!-- <div class="sign_up_info_box w-full flex flex-col gap-8 my-10 mx-auto text-justify text-[#4e4e5a] sm:text-center">
                    <div class="border-t border-dashed border-gray-300 pt-2 pb-2"></div>
                    <p class="text-base text-[#676767] sm:text-lg" v-html="props.infoData.notice"></p>
                </div> -->
                <!-- <div class="text-[#2f3158] text-center font-bold text-2xl border-2 border-dashed border-[#2f3158] rounded-2xl p-10">
                    <h2>報名額滿，感謝支持!</h2>
                </div> -->
            </form>
        </div>
    </div>

</template>

<style scoped lang="scss">
    .signup_wrap{
        max-width: 1366px;
        padding: 82px 110px 100px 190px;
    }

    .signup_vertical{
        position: absolute;
        top: 230px;
        left: 54px;
        width: 105px;
        height: auto;
        pointer-events: none;
        user-select: none;
    }

    .signUp_box{
        width: 100%;
        margin: 32px auto 0;
    }

    .signup_form{
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 18px;
        padding: 38px 42px 34px;
        border: 1px solid rgba(255, 255, 255, 0.92);
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.99);
        box-shadow: 0 15px 34px rgba(0, 28, 74, 0.25);
    }

    .form_row{
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr);
        align-items: start;
        gap: 16px;
        width: 100%;
    }

    .form_label{
        padding-top: 10px;
        color: #263c50;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.04em;
    }

    .required_mark{
        margin-right: 3px;
        color: #c32929;
    }

    .form_control{
        width: 100%;
        min-height: 44px;
        padding: 9px 12px;
        border: 1px solid #cfd6dc;
        border-radius: 2px;
        outline: none;
        background: #fff;
        color: #252d34;
        font-size: 15px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form_control:focus{
        border-color: #0a8fc2;
        box-shadow: 0 0 0 3px rgba(10, 143, 194, 0.13);
    }

    .select_group{
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 9px;
    }

    .option_list{
        display: flex;
        min-height: 44px;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 20px;
        padding: 7px 0;
        color: #333f49;
    }

    .option_item{
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 15px;
        cursor: pointer;
    }

    .option_checkbox,
    .agree_box input{
        width: 17px;
        height: 17px;
        flex: 0 0 auto;
        accent-color: #078fbd;
    }

    .form_other_input{
        width: 160px;
        padding: 4px 3px;
        border: 0;
        border-bottom: 1px solid #9eabb5;
        outline: none;
        background: transparent;
        color: #252d34;
        font-size: 14px;
    }

    .form_other_input:disabled{
        opacity: 0.45;
    }

    .privacy_box{
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 4px;
        padding: 20px 22px;
        background: #ededed;
        color: #464646;
    }

    .privacy_title{
        margin: 0;
        font-size: 15px;
        font-weight: 700;
    }

    .privacy_detail{
        margin: 0;
        font-size: 13px;
        line-height: 1.55;
        text-align: justify;
    }

    .agree_box{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 7px;
        margin: 0 auto;
        color: #464646;
        font-size: 15px;
        line-height: 1.5;
    }

    .agree_box input{
        margin-top: 3px;
    }

    .personal_information_terms_text{
        margin: 0 2px;
        color: #c32929;
        text-decoration: underline;
        text-underline-offset: 2px;
    }

    .submit_button{
        display: inline-flex;
        width: fit-content;
        margin: 4px auto 0;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease;
    }

    .submit_button:hover{
        transform: translateY(-2px);
        filter: brightness(1.06);
    }

    .submit_button:focus-visible{
        outline: 3px solid rgba(34, 217, 197, 0.65);
        outline-offset: 4px;
    }

    .submit_button img{
        width: auto;
        height: 48px;
    }

    @media screen and (max-width: 1024px){
        .signup_wrap{
            padding: 72px 38px 80px;
        }

        .signup_vertical{
            display: none;
        }
    }

    @media screen and (max-width: 720px){
        .signup_wrap{
            padding: 54px 20px 64px;
        }

        .signup_wrap :deep(.title){
            padding: 0 0.38em;
            font-size: 34px;
            letter-spacing: 3px;
        }

        .signUp_box{
            margin-top: 24px;
        }

        .signup_form{
            gap: 16px;
            padding: 26px 20px 28px;
        }

        .form_row{
            grid-template-columns: 1fr;
            gap: 6px;
        }

        .form_label{
            padding-top: 0;
            font-size: 15px;
        }

        .option_list{
            gap: 9px 14px;
        }

        .option_item{
            font-size: 14px;
        }

        .privacy_box{
            padding: 17px 16px;
        }

        .privacy_detail{
            font-size: 12px;
        }

        .agree_box{
            font-size: 14px;
        }
    }
</style>
