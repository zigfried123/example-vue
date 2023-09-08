<template>
    <pa_empty_stub_basic :message="'Пожалуйста, выберите тип выплаты'" :label="'Здравствуйте!'">

    </pa_empty_stub_basic>
</template>

<script>
    import Pa_empty_stub_basic from "../common/pa_empty_stub_basic.vue";
    export default {
        name: "pa_default",
        components: {
            Pa_empty_stub_basic,
        },
    }
</script>

<style scoped>

</style>