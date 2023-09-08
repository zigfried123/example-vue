<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown polls-notification" :class="{'open' : state.open}">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
            <i class="icon-user clearfix"></i>
            <span class="username"></span>
            <span class="badge action-ticket-unread-count" style="background-color: red;"></span>
        </a>
        <ul class="inbox dropdown-menu" style="padding-bottom: 5px; width: 400px; left: initial;">
            <li style="padding: 0px; text-transform: none;" class="nav-header">
                <p style="font-size: 16px">Профиль <img v-show="state.loading" class="userbar-loader" src="/assets/new/images/ajax-loader.gif"/></p>
            </li>
            <li class="nav-header">
                <div class="row-fluid">
                    <div class="span12">
                        <fieldset>
                            <dl class="dl-horizontal">
                                <dt><b>ID</b></dt>
                                <dd>
                                    {{ParamsAffiliate.id}}
                                </dd>

                                <dt><b>Вебмастер</b></dt>
                                <dd>
                                  {{ParamsAffiliate.name}}
                                </dd>

                                <dt><b>Уровень доступа</b></dt>
                                <dd>
                                    {{ParamsAffiliate.group}}
                                </dd>
                            </dl>
                        </fieldset>
                    </div>

                </div>
            </li>
            <li class="divider"></li>
            <li>
                <a tabindex="-1" href="/account/default"><i class="icon-user"></i> Информация об аккаунте</a>
            </li>
            <li v-show="ParamsAffiliate.show_tickets" class="divider"></li>
            <li v-show="ParamsAffiliate.show_tickets">
                <a tabindex="-1" href="/account/tickets"><i class="icon-comments"></i>
                <span class="badge action-ticket-unread-count" style="border-radius: 35%!important; background-color: #F00; color: #fff"></span>
                 Запросы в тех. поддержку <span class="badge badge-new">New</span></a>
            </li>
            <li class="divider"></li>
            <li>
                <a tabindex="-1" href="/logout"><i class="icon-key"></i> Выход</a>
            </li>
        </ul>
    </li>
</template>
<script>
    import { mapState } from 'vuex';
    export default {
        name: 'Profile',
        data () {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false
                },

            }
        },
        async mounted() {
            await this.$store.dispatch('getParams');
        },
        methods: {
            toggleOpen() {
                this.state.open = !this.state.open;
            },

        },
        computed: {
            ...mapState([
                'ParamsAffiliate'
            ])
        }
    }
</script>
