<template>
    <li v-if="items.length" @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown"
        :class="{'open' : states.open}" id="header_inbox_bar">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <i class="icon-envelope"></i>
            <span v-show="counts.new != 0" class="badge">{{counts.new}}</span>
        </a>
        <ul class="dropdown-menu inbox" style="margin-top: -0.5px;">
            <li>
                <p style="font-size: 16px">Последние уведомления
                    <img v-show="states.loading" src="/assets/new/images/ajax-loader.gif"/></p>
            </li>
            <li>
                <ul class="dropdown-menu-list" style=" margin-left: 0px; list-style: none;">
                    <li v-for="item in items">
                        <a :href="item.url" style="padding-right: 13px">
								<span class="subject"
                                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;">
									<span class="from" style="color: #000000;">
										<span :style="item.status == 'new' ? 'font-weight: bold; color: black;' : ''">
											<span style="font-size: 11px; color: #666;">{{ item.created }}</span>
                                            <br/> {{item.title}}
                                        </span>
                                    </span>
								</span>
                        </a>
                    </li>
                </ul>
            </li>
            <li style="background-color: #fff; padding: 7px 2px 12px 2px; border: 1px solid #f4f4f4; text-align: center;  clear: both; ">
                <div class="buttons">
                    <a class="btn green" :href="url_show_all">Показать все</a>
                    <a class="btn blue" :disabled="!getUnread().length"
                       @click.stop="markAllAsRead">Отметить все как прочитанные</a>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
    import axios from 'axios';
    import filter from 'lodash/filter';
    export default {
        name: 'inbox-bar',
        props: {
            'url_show_all': {
                type: String,
                default: '/account/default/notice'
            },
            'url_get_notifications': {
                type: String,
                default: '/account/default/getNotifications'
            },
            'mark_all_as_read': {
                type: String,
                default: '/account/default/markAllAsRead'
            }
        },
        data () {
            return {
                states: {
                    open: false,
                    loading: false,
                },
                counts: {},
                items: [],
            }
        },
        mounted() {
            this.getItems();
        },
        methods: {
            getUnread() {
                return filter(this.items, function (o) {
                    return o.status == 'new';
                });
            },
            toggleOpen() {
                this.states.open = !this.states.open;
            },
            markAllAsRead(){
                if (!this.getUnread().length) {
                    return false;
                }
                let vm = this;
                vm.states.loading = true;
                axios
                    .get(this.mark_all_as_read)
                    .then(function (response) {
                        let newItems = [];
                        for (let i in vm.items) {
                            let item = vm.items[i];
                            item['status'] = 'read';
                            newItems.push(item);
                        }
                        vm.items = newItems;
                        vm.counts['new'] = 0;
                    })
                    .catch(function () {

                    })
                    .then(function () {
                        vm.states.loading = false;
                    });
            },
            getItems() {
                let vm = this;
                vm.states.loading = true;
                axios
                    .get(this.url_get_notifications + '?limit=5')
                    .then(function (response) {
                        vm.counts = response.data.counts;
                        vm.items = response.data.items;
                    })
                    .catch(function () {

                    })
                    .then(function () {
                        vm.states.loading = false;
                    });
                return [];
            }
        }
    }
</script>
<style>
    .btn.blue, .btn.green {
        color: white !important;
    }
</style>