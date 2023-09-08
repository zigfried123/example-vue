<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown" :class="{'open' : state.open}">
        <a class="dropdown-toggle manager-icon" data-toggle="dropdown" href="#">
				<span style="display:inline-block;">
					<img style="border-radius: 50% !important; width: 29px; height:29px;"
                         v-if="ParamsAffiliate.manager"
                         :src="ParamsAffiliate.manager.photo" alt="">
				</span>
        </a>
        <ul class="dropdown-menu inbox" style="">
            <li>
                <p style="font-size: 16px">Персональный менеджер</p>
            </li>
            <li class="nav-header">
                <div class="row-fluid" style="margin-bottom: 15px;">
                    <div class="personal_manager_dropdown" v-if="ParamsAffiliate.manager">
                        <div class="span12">
                            <h5>{{ ParamsAffiliate.manager.name }}</h5>
                            <div>
                                <img :src="ParamsAffiliate.manager.photo" alt="">
                            </div>
                            <ul>
                                <li v-if="ParamsAffiliate.manager.skype">
                                    <img src="/images/skype.png" alt="">
                                    <a :href="'skype:' + ParamsAffiliate.manager.skype + '?chat'">{{ParamsAffiliate.manager.skype}}</a>
                                </li>
                                <li v-if="ParamsAffiliate.manager.icq">
                                    <img src="/images/icq.png" alt="">
                                    <a :href="'icq:'+ParamsAffiliate.manager.icq">{{ParamsAffiliate.manager.icq}}</a>
                                </li>
                                <li v-if="ParamsAffiliate.manager.email">
                                    <img src="/images/email.png" alt="">
                                    <a :href="'mailto:'+ParamsAffiliate.manager.email">{{ParamsAffiliate.manager.email}}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="span12" style="padding-top: 5px;">
                            <div class="jivo-btn jivo-online-btn jivo-btn-light"
                                 onclick="jivo_api.open({start : 'chat'})"
                                 style="font-family: Arial, Arial;font-size: 16px;background-color: #008735;
                                 border-radius: 0px;-moz-border-radius: 0px;-webkit-border-radius: 0px;height: 40px;
                                 line-height: 40px;padding: 0 20px 0 20px;font-weight: normal;font-style: normal">

                                <div class="jivo-btn-icon"
                                     style="background-image: url(//static.jivosite.com/button/chat_light.png);"></div>
                                Задайте ваш вопрос!
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: 'Manager',
        data() {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false
                }
            }
        },
        computed: {
            ...mapState([
                'ParamsAffiliate'
            ])
        },
        async mounted() {
            await this.$store.dispatch('getParams');
        },
        methods: {
          toggleOpen() {
                this.state.open = !this.state.open;
            }
        }
    }

</script>

<style>
    .jivo-btn {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        text-transform: none;
        cursor: pointer;
        background-image: none;
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.428571429;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        border: 0px;
        border-radius: 4px;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .jivo-btn:hover {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 0 20px 10px rgba(255, 255, 255, 0.3);
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 0 20px 10px rgba(255, 255, 255, 0.3);
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 0 20px 10px rgba(255, 255, 255, 0.3);
    }

    .jivo-btn.jivo-btn-light:hover {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 0 20px 10px rgba(255, 255, 255, 0.1);
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 0 20px 10px rgba(255, 255, 255, 0.1);
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 0 20px 10px rgba(255, 255, 255, 0.1);
    }

    .jivo-btn.jivo-btn-light {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.3);
    }

    .jivo-btn:active,
    .jivo-btn.jivo-btn-light:active {
        box-shadow: 0 1px 0px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0 1px 0px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 1px 0px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    .jivo-btn:active {
        outline: 0;
        background-image: none;
        -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    }

    .jivo-btn-gradient {
        background-image: url(//static.jivosite.com/button/white_grad_light.png);
        background-repeat: repeat-x;
    }

    .jivo-btn-light.jivo-btn-gradient {
        background-image: url(//static.jivosite.com/button/white_grad.png);
    }

    .jivo-btn-icon {
        width: 17px;
        height: 20px;
        background-repeat: no-repeat;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        margin-left: -5px;
    }

    .jivo-btn-light {
        color: #fff;
    }

    .jivo-btn-dark {
        color: #222;
    }
</style>
