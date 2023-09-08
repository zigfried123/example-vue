<template>
    <div>
        <input v-model="privateState.count" type="text"> всего <br/><br/>
        <input v-model="privateState.ratio" type="text"> на уровнях <br/><br/>
        <input v-model="privateState.levels" type="text"> уровней <br/><br/>
        с <input v-model="privateState.lengthQ" type="text"> символов начинать поиск <br/><br/>
        <button @click="handleOk">Ок</button>{{sharedState.load}}<br/><br/>
    </div>
</template>

<script>
    import Store from './Store'

    export default {
        name: 'tests',
        data(){
            return {
                sharedState: Store.state,
                privateState: {
                    count: Store.state.count,
                    ratio:  Store.state.ratio,
                    levels:  Store.state.levels,
                    lengthQ:  Store.state.lengthQ
                }

            }
        },
        methods: {
            handleOk() {
                Store.setCount(this.privateState.count)
                Store.setRatio(this.privateState.ratio)
                Store.setLevels(this.privateState.levels)
                Store.setLengthQ(this.privateState.lengthQ)
                Store.getTree();
            }
        }
    }
</script>