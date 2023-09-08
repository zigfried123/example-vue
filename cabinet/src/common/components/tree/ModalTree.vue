<template>
     <modal>
         <template slot="header">
             <h3>Универсальный виджет (гео, устройсва и т.д.)</h3>
         </template>
         <template slot="body" class="modal-body">
             <Tree/>
         </template>
     </modal>
</template>

<script>
    import Modal from '../modals/Modal.vue'
    import Store from './Store'
    import Tree from './Tree.vue'

    export default {
        name: 'ModalTree',
        components: {
            Modal,
            Tree
        },
        props: [],
        data () {
            return {
                privateState: Object,
                sharedState: Store.state
            }
        },
        mounted () {

        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped>
    .modal-body {
        background: #fff;
    }
</style>