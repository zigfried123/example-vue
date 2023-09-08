<template>
    <div>
        <md-field :class="messageClass">
            <label :for="config.name">
                {{ config.label }}
            </label>
            <md-select v-model="model" :name="config.name" :multiple="config.multiple" :disabled="config.disabled">
                <md-option v-for="(option, value, index) in config.options" :key="index" :value="value">{{ option }}
                </md-option>
            </md-select>
        </md-field>

    </div>
</template>

<script>
    import _widget_mixin from './_widget_mixin';

    export default {
        mixins: [_widget_mixin],
        name: "selectField",
        data() {
            return {
                model: [],
            }
        },
    }
</script>

<style scoped>

</style>