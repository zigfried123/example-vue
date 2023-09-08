<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown menu-item" :class="{'open' : state.open}">
        <a class="dropdown-toggle menu-item__title" data-toggle="dropdown" href="#"></a>
        <ul class="dropdown-menu" style="left: initial;">
            <li>
                <div class="banners__top">
                    <div class="banners__top-title">Джекпот:</div>
                    <div class="banners__flex">
                        <div class="banners__top-sum"> {{state.data.potentialIncome}} ₽</div>
                        <div class="banners__top-date">Прогноз на {{state.data.dateFinish}} г.
                            <i class="fa fa-question-circle help-tip">
                                <p>Базой для расчета прогноза являются показатели активности вебмастеров за предыдущий
                                    день.</p>
                            </i>
                        </div>
                    </div>
                </div>
                <div class="banners__box">
                    <div class="banners__info">Текущий Джекпот:
                        <span class="action_jackpot_counter"> {{state.data.newCounterValue}}</span>
                        <b style="color: #000;">₽</b>
                    </div>
                    <div v-if="state.data.balance" class="banners__info">Набрано баллов:
                        <span>{{state.data.balance}} баллов</span>
                    </div>
                    <div v-if="state.data.currentPlace" class="banners__info">Место в рейтинге:
                        <span>{{state.data.currentPlace}} место</span>
                    </div>
                    <!--<div class="banners__info">Индекс акции: <span> 5,4</span>
                        <div class="banners__question"><span>?</span></div>
                    </div>-->
                    <div class="banners__flex href">
                        <a v-bind:href="state.data.currentURL + '/information/action2019/main'">Условия</a>
                        <a v-bind:href="state.data.currentURL + '/information/action2019/description'">Описание
                            Акции</a>
                        <a v-bind:href="state.data.currentURL + '/information/action2019/main#rating'">Рейтинг</a>
                        <a v-bind:href="state.data.currentURL + '/information/action2019/sponsors'">Акции от спонсоров</a>

                    </div>
                </div>
            </li>
        </ul>
    </li>
</template>
<style scoped>
    @charset "UTF-8";
    @import url(https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,latin-ext);

    .menu-item {
        font-family: Roboto, sans-serif;
        line-height: normal
    }

    .menu-item {
        font-family: Roboto, sans-serif;
        line-height: normal
    }

    .menu-item__title {
        width: 76px;
        cursor: pointer;
        height: 45px;
        background: url(../../../../../public_html/assets/action2019/images/menu-item__back.png) no-repeat !important;
        box-sizing: border-box
    }

    .menu-item__title:hover {
        background-color: transparent;
        background-image: url(../../../../../public_html/assets/action2019/images/menu-item__back.png);
        background-repeat: no-repeat
    }

    .banners__box {
        background: #fff;
        box-sizing: border-box;
        padding: 0 25px 0 25px;
        height: 198px;
        width: 415px;
        font-family: Roboto, sans-serif;
        border-radius: 0 0 0 0 !important;

    }

    @media (max-width: 570.98px) {
        .banners__box {
            padding: 0px 8px 0px 8px;
        }
    }

    .banners__top {
        height: 90px;
        background: #4644f7;
        padding: 0 25px 0 25px;
        box-sizing: border-box;
        /*    box-shadow: 0 0 15px 0 rgba(50, 50, 50, .75)*/
    }


    @media (max-width: 570.98px) {
        .banners__top {
            padding: 0 8px 0 8px;
        }

    }

    .banners__top-sum {
        font-size: 23px;
        font-weight: 900;
        letter-spacing: -2px;
        color: #FFEB36
    }

    @media (min-width: 480px) {
        .banners__top-sum {
            font-size: 31px;

        }
    }

    @media (min-width: 1300px) {
        .banners__top-sum {
            font-size: 31px
        }
    }

    .banners__top-title {
        color: #fff;
        padding-top: 20px;
        font-size: 16px
    }

    .banners__question span {
        display: inline-block;
        margin-left: 6px;
        padding-top: 2px
    }

    .banners__top-date {
        border-radius: 5px !important;
        margin-left: 10px;
        border: 1px solid #ffeb36;
        color: #ffeb36;
        font-size: 12px;
        padding: 6px 10px 6px 10px
    }

    .banners__info {
        color: #667195;
        margin-bottom: 10px

    }

    .banners__info:first-child {
        padding-top: 38px;
    }


    .banners__info span {
        font-weight: 900;
        color: #000
    }

    .banners__flex {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center
    }

    .banners__flex.href {
        margin-top: 30px
    }

    .banners__flex a {
        color: #3d3bff;
        font-size: 12px;
        font-weight: 500;
        margin-left: 20px
    }

    .banners__flex a:first-child {
        margin-left: 0
    }

    .help-tip {
        text-align: center;
        font-size: 14px;
        line-height: 26px;
        cursor: default;
        position: relative;
    }

    .help-tip:before {
        font-weight: bold;
    }

    .help-tip:hover p {
        display: block;
        opacity: .98;
        transform-origin: 100% 0%;

        -webkit-animation: fadeIn 0.3s ease-in-out;
        animation: fadeIn 0.3s ease-in-out;

    }

    .help-tip p { /* The tooltip */
        display: none;
        text-align: left;
        background-color: #eeeeee;
        padding: 15px;
        width: 220px;
        position: absolute;
        margin-top: 10px;
        right: -8px;
        border-radius: 8px;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
        color: #000;
        font-family: sans-serif, Arial, Verdana, "Trebuchet MS";
        font-size: 15px;
        line-height: 1.4;
    }

    .help-tip p:before { /* The pointer of the tooltip */
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: #eeeeee;
        right: 8px;
        top: -12px;
    }

    .help-tip p:after { /* Prevents the tooltip from being hidden */
        width: 100%;
        height: 40px;
        content: '';
        position: absolute;
        top: -40px;
        left: 0;
    }

    /* CSS animation */

    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0;
            transform: scale(0.6);
        }

        100% {
            opacity: 100%;
            transform: scale(1);
        }
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 100%;
        }
    }
</style>
<script>
    import axios from 'axios';

    export default {
        name: 'Action2019Detailed',
        data() {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false,
                    data: {
                        currentURL: null,
                        potentialIncome: null,
                        dateFinish: null,
                        currentPlace: null,
                        balance: null,
                        newCounterValue: null,
                    }
                },
                api: '/information/userbar/jackpot'
            }
        },
        mounted() {
            this.getData(this.api);
        },
        methods: {
            toggleOpen() {
                this.state.open = !this.state.open;
                if (this.state.open && !this.state.loading && !this.state.loaded) {
                    this.getData(this.api);
                }
            },
            getData(url) {
                this.state.loading = true;
                axios.get(url)
                    .then((response) => {
                        let data = response.data;

                        this.state.loading = false;
                        this.state.loaded = true;
                        this.state.data = data;
                    }).catch()
            },
        }
    }
</script>
