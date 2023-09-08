<template>
    <li v-if="state.restrictionCount" @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown notification" :class="{'open' : state.open}">
        <a href="#" class="dropdown-toggle pulse"
           style="outline: 0px; box-shadow: rgba(191, 28, 86, 0) 0px 0px 13px; outline-offset: 20px;">
            <i class="icon-bell"></i>
            <span v-if="state.restrictionCount" class="badge" style="background-color:red;">{{state.restrictionCount}}</span>
        </a>
        <ul class="dropdown-menu extended notification" style="max-width: 400px !important; width: 400px !important;">
            <li v-if="state.isRequiredRestrictions">
                <p style="font-size: 16px">Для начала работы Вам необходимо выполнить следующие действия:</p>
            </li>
            <li v-if="!state.isRequiredRestrictions && !state.isRestrictions" style="padding: 0; text-transform: none;">
                <p style="font-size: 16px;" >Рекомендации: <img src="/assets/new/images/ajax-loader.gif" class="userbar-loader"/></p>
            </li>
            <li>
                <ul v-if="item.required" v-for="item in state.restrictions" class="dropdown-menu-list" style="margin-left: 0px; list-style: none;">
                    <li>
                        <a :href="item.url">
                            <span class="label label-important r-icon-container"><i class="icon-bell"></i></span>
                            {{ item.name }}
                        </a>
                    </li>
                </ul>
            </li>
            <li v-if="state.isRestrictions">
                <p style="font-size: 16px;">Также Вы можете: </p>
            </li>
            <li>
                <ul v-if="!item.required" v-for="item in state.restrictions" class="dropdown-menu-list" style="margin-left: 0px; list-style: none;">
                    <li>
                        <a :target="item.target ? '_blank' : ''" :href="item.url">
                            <span class="label label-success"><i class="icon-bell"></i></span>
                            {{ item.name }}
                        </a>
                    </li>
                </ul>
            </li>
            <li style="background-color: #fff; padding: 7px 2px 12px 2px; border: 1px solid #f4f4f4; text-align: center;  clear: both; ">
                <div class="buttons">
                    <a class="btn green" :href="url_configurate_notifications">Настроить уведомления</a>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
    import axios from 'axios'
    export default {
        name: 'Restrictions',
        props: {
            'url_configurate_notifications': {
                type: String,
                default: '/account/default/subscribeUpdate'
            },
        },
        data () {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false,
                    restrictions: null,
                    isRestrictions: false,
                    isRequiredRestrictions: false,
                    restrictionCount: null
                },
                api: '/information/userbar/restrictions',
                apiRestrictionCounter: '/information/userbar/restrictionCounter'
            }
        },
        mounted() {
            this.getRestrictionCounter(this.apiRestrictionCounter);
        },
        methods: {
            toggleOpen() {
                this.state.open = !this.state.open;
                if(this.state.open && !this.state.loading && !this.state.loaded) {
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
                        this.state.restrictions = data;
                        this.setIsRestrictions(data);
                        this.setIsRequiredRestrictions(data);
                    })
                    .catch()
            },
            getRestrictionCounter(url) {
                axios.get(url)
                    .then((response) => {
                        let data = response.data.count;
                        this.state.restrictionCount = data;
                    })
                    .catch()
            },
            setIsRestrictions(obj) {
                Object.keys(obj).map((i) => {
                    if(obj[i] && !obj[i].required) this.state.isRestrictions = true;
                })
            },
            setIsRequiredRestrictions(obj) {
                Object.keys(obj).map((i) => {
                    if(obj[i] && obj[i].required) this.state.isRequiredRestrictions = true;
                })
            }
        }
    }
</script>
<style>
    .r-icon-container{
        width: 20px !important;
    }
</style>