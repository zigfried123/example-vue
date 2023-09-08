<template>
    <div>
        <autocomplete
                v-bind:error="error"
                :label="config.label"
                :action="config.action"
                :key="null"
                :multiple="!!config.multiple"
                :minLength="config.minLength"
        ></autocomplete>
    </div>
</template>

<script>
    import Autocomplete from "../common/autocomplete.vue";
    import _widget_mixin from "./_widget_mixin";

    export default {
        name: "autocompleteField",
        mixins: [_widget_mixin],
        components: {Autocomplete},

    }
</script>

<style scoped>
</style>