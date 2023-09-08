<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown action-robbery"
        :class="{'open' : state.open}">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" style="height: 45px;width: 45px;padding: 0px 4px!important;">
            <img width='100%' height='100%' src="/assets/new/images/menu-icon-robbery.png">
        </a>
        <ul class="dropdown-menu" style="left: initial;">
            <li>
                <div class="b-action-menu">
                    <div class="b-action-menu__main_title">ОГРАБЛЕНИЕ с LEADS.su</div>
                    <div class="b-action-menu__prize_date">Дата розыгрыша: {{ state.data.nearestDate }}</div>
                    <br/>
                    <div class="b-action-menu__title"> На вашем счете:</div>
                    <div class="b-action-menu__sum-box">
                        <div class="b-action-menu__sum-box_sum">{{ state.data.balance }} <span>баллов</span></div>
                    </div>

                    <div class="b-action-menu__title"> Всего заработано:</div>
                    <div class="b-action-menu__sum-box">
                        <div class="b-action-menu__sum-box_sum">{{ state.data.allBalance }} <span>баллов</span></div>
                    </div>

                    <a class="b-action-menu__buttons" href="/information/actionRobbery/main">Условия акции</a>
                    <div class="b-action-menu__title">Куплено билетов:</div>
                    <div class="b-action-menu__tickets" v-for="item in state.data.tickets">
                        <div class="b-action-menu__tickets-box">
                            <div class="b-action-menu__tickets-box_name"> {{ item.name }}</div>
                            <div class="b-action-menu__tickets-box_info">1 билет = {{ item.cost }} баллов</div>
                        </div>
                        <div class="b-action-menu__tickets-sum">
                            {{ item.allSum}}
                            <div class="b-action-menu__tickets-sum_title">билетов</div>
                        </div>
                    </div>
                    <a style="margin-top: 20px" class="b-action-menu__buttons" href="/information/actionRobbery/store">Купить билеты</a>
                    <a style="margin-top: 20px;" class="b-action-menu__buttons go-shop-b" href="/information/actionRobbery/store">МАГАЗИН LEADS.SU</a>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
    import axios from 'axios';

    export default {
        name: 'ActionRobbery',
        data() {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false,
                    data: {
                        balance: null,
                        allBalance: null,
                        tickets: null,
                        nearestDate: null,
                    }
                },
                api: '/information/userbar/robbery'
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
            }).
                catch()
            }
        }
    }
</script>
