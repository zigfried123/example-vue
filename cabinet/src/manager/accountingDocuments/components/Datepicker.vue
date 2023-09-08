<template>
    <div>
        <md-datepicker v-model="internalDate" md-immediately v-if="!disabled" :md-disabled-dates="disabledDates"
                       :md-model-type="String"/>

        <md-field v-if="disabled">
            <md-icon>event</md-icon>
            <md-input v-model="internalDate" disabled></md-input>
        </md-field>
    </div>
</template>

<script>
    export default {
        name: 'datepicker',
        props: {
            disabled: Boolean,
            modelDate: String,
            disabledDates: Function,
        },
        computed : {
            internalDate: {
                get() {
                    return this.modelDate;
                },
                set(value) {
                    this.$emit('update:modelDate', value);
                }
            },
        },
    }
</script>
