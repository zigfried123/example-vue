<template>
    <div>
        <md-field :class="messageClass">
            <label>{{ config.label }}</label>
            <span class="md-prefix" v-if="config.prefix">{{ config.prefix }}</span>


            <md-input v-if="config.mask"
                      v-mask="config.mask"
                      v-model="model"
                      :type="config.type"
                      v-on:focusout="ready = true"
                      v-bind:pattern="config.mask"
            ></md-input>
            <md-input v-else
                      v-model="model"
                      :type="config.type"
                      v-on:change="ready = true"
            ></md-input>

            <span class="md-helper-text">{{ config.helperText}}</span>
            <span v-if="error" class="md-error">{{ error }}</span>

        </md-field>
    </div>

</template>

<script>
    import _widget_mixin from './_widget_mixin';

    export default {
        mixins: [_widget_mixin]
    }
</script>

<style scoped>

</style>