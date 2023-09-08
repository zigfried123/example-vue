<template>
    <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <span>
                Стратегия обработки
            </span>
            <md-field :class="validationClass">
                <md-select v-model="strategy"
                           name="strategy"
                           placeholder="Выберите стратегию обработки"
                           :disabled="isViewMode">
                    <md-option v-for="item in strategySelectOptions" :value="item.value" :key="item.value">
                        {{item.label}}
                    </md-option>
                </md-select>
            </md-field>
        </div>
        <div v-if="strategy" class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
            <div class="tip" v-html="tip"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "strategy-select",
        props: {
            isViewMode: Boolean,
            validationClass: Object
        },
        data: () =>({
            strategySelectOptions: [
                {
                    value: 'FullRejectStrategy',
                    label: 'Отказ от всех задолженностей по конверсиям',
                    tip:
                    '<ul>' +
                      '<li>Сторно баланса Вебмастера</li>' +
                      '<li>Сторно баланса Рекламодателя</li>' +
                      '<li>Снятие блокировки</li>' +
                      '<li>Смена ОБЩЕГО статуса конверсии на ожидаемый</li>' +
                      '<li>Снятие метки о необходимости ручного вмешательства</li>' +
                    '</ul>' +
                    '<p>Фин. результат: отказ от всех задолженностей по конверсиям</p>'
                },
                {
                    value: 'AdvertiserRejectStrategy',
                    label: 'Конверсии оплачиваются Вебмастеру за счёт компании',
                    tip:
                    '<ul>' +
                      '<li>Сторно баланса Рекламодателя</li>' +
                      '<li>Смена статуса РЕКЛАМОДАТЕЛЯ у конверсии на ожидаемый, ОБЩИЙ статус - не меняется</li>' +
                      '<li>Снятие метки о необходимости ручного вмешательства</li>' +
                    '</ul>' +
                    '<p>Фин. результат: конверсии будут выплачены Вебмастеру за счёт компании</p>'
                },
                {
                    value: 'ForceApproveStrategy',
                    label: 'Отказ от изменения статусов конверсий',
                    tip:
                    '<ul>' +
                      '<li>Снятие метки о необходимости ручного вмешательства</li>' +
                      '<li>Статусы конверсии НЕ изменяются</li>' +
                      '<li>Балансы Вебмастера и Рекламодателя НЕ сторнируются</li>' +
                      '</ul>' +
                    '<p>Фин. результат: конверсии будут оплачены Рекламодателем и будут выплачены Вебмастеру</p>'
                },
            ],
        }),
        computed : {
            strategy: {
                get() {
                    return this.$store.getters.STRATEGY;
                },
                set(value) {
                    this.$store.commit('SET_STRATEGY', value)
                }
            },
            tip() {
                for (let index in this.strategySelectOptions) {
                    if (this.strategySelectOptions[index].value === this.strategy) {
                        return this.strategySelectOptions[index].tip;
                    }
                }
            }
        },
    }
</script>

<style scoped lang="scss">
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }
  }

</style>
