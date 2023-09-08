<template>
    <div class="pa__flex h-items-center v-items-center v-stretch ">
        <div class="pa__flex v-items-center v-column">
            <i class="fa pa__stub__icon" v-bind:class="icon ? icon : 'fa-file-o'">

            </i>
            <br>
            <span class="pa__empty_stub__message">{{ message }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pa_empty_stub",
        props: {
            message: {type: String},
            icon: {type: String}
        },
    }
</script>

<style scoped>
    .pa__stub__icon {
        font-size: 48px;
        color: gray;
    }

    .pa__empty_stub__message {
        margin: 10px;
        color: gray;
    }
</style>