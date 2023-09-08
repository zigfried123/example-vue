<template>
    <input class="universal-tree__search-input" v-model="sharedState.q" @keyup="handleChange" placeholder="Поиск" type="text">
</template>

<script>
    import Store from './Store';

    export default {
        name: 'search',
        data () {
            return {
                localState: {
                    changeInterval: 500,
                    timer: ''
                },
                sharedState: Store.state
            }
        },
        methods: {
            handleChange() {
                let q = this.sharedState.q;

                clearTimeout(this.localState.timer);

                this.localState.timer = setTimeout(() => {

                    if(q.length >= this.sharedState.lengthQ) {

                        Store.foundClean (this.sharedState.tree);

                        Store.search(q, this.sharedState.tree);

                        Store.parentFound(this.sharedState.tree);

                    } else {
                        Store.foundClean (this.sharedState.tree);
                        Store.search('', this.sharedState.tree);
                    }

                    //Store.setQ(q);

                }, this.localState.changeInterval);
            }
        }
    }
</script>

<style scoped>
    .universal-tree__search-input {
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        height: 30px;
    }
</style>