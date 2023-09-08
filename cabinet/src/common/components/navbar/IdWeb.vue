<template>
    <li class="state_account_id" v-if="ParamsAffiliate">
        ID {{ParamsAffiliate.id}}
    </li>
</template>
<script>
    import { mapState } from 'vuex';
    export default {
        name: 'IdWeb',
        computed: {
            ...mapState([
                'ParamsAffiliate'
            ])
        },
        async mounted() {
            await this.$store.dispatch('getParams');
        }
    }
</script>
<style>
    .state_account_id {
        color: #999999;
        display: block;
        padding: 0 12px 8px 0;
        margin-top: 14px !important;
        margin-left: -5px !important;

    }

    .header .nav > li.state_account_id {
        margin-top: 14px !important;
    }

    @media (max-width: 600px) {
        .header .nav > li.state_account_id {
            margin-top: 18px !important;
        }
    }
</style>
