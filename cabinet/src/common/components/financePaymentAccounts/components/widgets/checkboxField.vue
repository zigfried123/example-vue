<template>
    <div>
        <md-checkbox
                v-model="model"
                class="md-primary"
                :class="stateClass"
                v-on:change="ready = true"
        >
            <span v-html="config.label"></span>
            <div v-if="error">
                <small>{{ error }}</small>
            </div>
        </md-checkbox>

    </div>

</template>

<script>
    import _widget_mixin from './_widget_mixin';

    export default {
        mixins: [_widget_mixin],
        data() {
            return {
                model: false
            }
        },
        computed: {
            stateClass() {
                return {
                    '__error': !!this.error,
                }
            },
        }
    }
</script>
