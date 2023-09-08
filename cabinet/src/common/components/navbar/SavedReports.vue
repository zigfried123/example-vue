<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown saved-reports" :class="{'open' : state.open}">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-list clearfix"></i></a>
        <ul class="inbox dropdown-menu" style="padding-bottom: 15px; width: 400px; left: initial;">
            <li style="padding: 0px; text-transform: none;" class="nav-header">
                <p style="font-size: 16px">Сохраненные отчеты <img class="userbar-loader" v-show="state.loading" src="/assets/new/images/ajax-loader.gif"/></p>
            </li>

            <template v-for="(values, key) in state.reports">
                <li class="title nav-header"><span>{{key}}</span></li>
                <li style="margin-top: 0px;" class="nav-header" v-for="item in values">
                    <form style="margin:0px; margin-left: 5px; padding: 0px;" method="post" :action="'/'+key">
                        <button class="btn-link" style="padding: 0px; margin: 0px;width: 100%;text-align: left;"
                                name="common_components_dataproviderconfigurator_web_models_ActiveFormModel[action][load]"
                                :title="item.label" type="submit" :value="item.id">
                            {{item.label}}
                        </button>
                    </form>
                </li>
            </template>

            <li v-if="Array.isArray(state.reports)" class="title nav-header" style="display:block; padding-top:10px;padding-bottom:10px">
                <span>У Вас нет сохраненных отчетов</span>
            </li>
        </ul>
    </li>
</template>
<script>
    import axios from 'axios';
    export default {
        name: 'SavedReports',
        data () {
            return {
                state: {
                    open: false,
                    loading: false,
                    loaded: false,
                    reports: null
                },
                api: '/information/userbar/reports'
            }
        },
        mounted() {

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
                        this.state.reports = data;
                    })
                    .catch()
            }
        }
    }
</script>