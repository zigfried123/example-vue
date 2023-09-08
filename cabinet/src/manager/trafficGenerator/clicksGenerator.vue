<template>
    <md-card>
        <md-card-content>
            <clicks-form :base-url="baseUrl" :tracker-url="trackerUrl"/>
        </md-card-content>
    </md-card>
</template>

<script>
    import shareMethodsMixin from "./mixins/shareMethodsMixin";
    import ClicksForm from "./components/clicksForm.vue";

    export default {
        name: "ClicksGenerator",
        components: {
            clicksForm: ClicksForm
        },
        props: {
            baseUrl: String,
            trackerUrl: String,
            advSub: String,
        },
    }

</script>

<style scoped>
    .md-select {
        width: 100%;
    }
</style>