<template>
    <div>
        <div >
            <div class="link-payout">
                {{ currencyFormat(cell.holdValue) }}
            </div>
        </div>
        <div >
            {{ currencyFormat(cell.totalApprovedValueAfterHold) }}
        </div>
    </div>
</template>

<script>
    import {currencyFormat} from './../helpers/format';
    export default {
        name: "cellHold",
        props: {
            cell: Object
        },
        methods:{
            currencyFormat(value) {
                return currencyFormat(value)
            }
        }
    }
</script>
