<template>
    <md-card>
        <md-card-content>
            <clicks-form :base-url="baseUrl" :tracker-url="trackerUrl" :advertiser-sub="advertiserSub" ></clicks-form>
            <div class="md-layout md-gutter">
            <task-buttons-block :button-action="pullClicks"
                                button-caption="1. RUN pullClicks"
                                button-tooltip="Запускает таск, который перенесет сгенерированные клики из redis в crate"
                                :loading="loading"/>

            <task-buttons-block :button-action="pullConversions"
                                button-caption="2. RUN pullConversions"
                                button-tooltip="Загружает конверсии из Redis трекера в БД личного кабинета"
                                :loading="loading"/>

            <task-buttons-block :button-action="updateEventsByConversions"
                                button-caption="3. RUN EventsByConversions"
                                button-tooltip="Обновляет события по конверсиям в mariaDB"
                                :loading="loading"/>

            <task-buttons-block :button-action="updateCrateConversions"
                                button-caption="4. RUN CrateConversions"
                                button-tooltip="Запускает таск, который переносит конверсии из mariaDB в crate"
                                :loading="loading"/>

            <task-buttons-block :button-action="updateCrateEvents"
                                button-caption="5. RUN CrateEvents"
                                button-tooltip="Запускает таск, который переносит события из mariaDB в Crate"
                                :loading="loading"/>

            <div class="md-layout-item md-size-100">
                <md-field>
                    <md-tooltip md-delay="500" md-direction="top">
                        Поле для отображения всех ответов таксков
                    </md-tooltip>

                    <md-textarea v-model="tasksResponse" placeholder="..."  md-autogrow  disabled></md-textarea>
                </md-field>
            </div>
            </div>
        </md-card-content>
    </md-card>
</template>

<script>

    import shareMethodsMixin from "./mixins/shareMethodsMixin";
    import ClicksForm from "./components/clicksForm.vue";
    import TaskButtonsBlock from "./components/tasksButtonsBlock.vue";

    const awaitingMessage = 'Идет обработка запроса. Пожалуйста, подождите...';
    export default {
        name: "ConversionsGenerator",
        mixins: [shareMethodsMixin],
        components: {
            clicksForm: ClicksForm,
            taskButtonsBlock: TaskButtonsBlock,
        },

        props: {
            baseUrl: String,
            trackerUrl: String,
            taskClicks: String,
            taskConversions: String,
            taskEvents: String,
            taskCrate: String,
            taskCrateConversions: String,
            advertiserSub: String,
            transactions: String,
        },
        data: () => ({
            loading: false,
            tasksResponse: '...'
        }),

        computed: {
            urlTaskExecute() {
                return this.baseUrl + '/taskExecute';
            },
        },
        methods: {
            async pullClicks() {
                this.loading = true;
                this.tasksResponse = awaitingMessage;
                this.sendData(this.taskClicks);
                this.loading = false;
            },
            async pullConversions() {
                this.loading = true;
                this.tasksResponse = awaitingMessage;
                this.sendData(this.taskConversions);
                this.loading = false;
            },
            async updateEventsByConversions() {
                this.loading = true;
                this.tasksResponse = awaitingMessage;
                this.sendData(this.taskEvents);
                this.loading = false;
            },
            async updateCrateEvents() {
                this.loading = true;
                this.tasksResponse = awaitingMessage;
                this.sendData(this.taskCrate);
                this.loading = false;
            },

            async updateCrateConversions() {
                this.loading = true;
                this.tasksResponse = awaitingMessage;
                this.sendData(this.taskCrateConversions);
                this.loading = false;
            },

            async sendData(task) {
                let data = new FormData();
                data.append('task', task);
                const result = await axios.post(this.urlTaskExecute, data);

                this.tasksResponse = result.data;
            }
        }
    }
</script>

<style scoped>

</style>