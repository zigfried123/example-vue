<template>
    <keep-alive>
        <img v-if="exists" :src="getIconPath()" :alt="icon" @error="hide()"/>
    </keep-alive>
</template>

<script>
    import agent from '../../assets/images/agent.svg';
    import bank from '../../assets/images/bank.svg';
    import card from '../../assets/images/card.svg';
    import ewallet from '../../assets/images/ewallet.svg';
    import mobile from '../../assets/images/mobile.svg';
    import recommend from '../../assets/images/recommend.svg';

    export default {
        name: "pa__icon",
        props: {
            icon: {type: String}
        },
        data() {
            return {
                exists: true
            }
        },
        methods: {
            getIconPath() {
                return '/vue/' + this.icon + '.svg';
            },
            hide() {
                this.exists = false;
            }
        },
    }
</script>

<style scoped>

</style>