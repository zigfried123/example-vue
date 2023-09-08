<template>
  <div class="btn-toolbar">

    <div class="btn-group">
      <a href="" v-if="hasPrev()" @click.prevent="changePage(prevPage)" class="btn btn-pgn">Назад</a>
      <a href="" v-if="hasFirst()" @click.prevent="changePage(1)" class="btn btn-pgn btn-first">1</a>
      <a href="" @click.prevent="changePage(page)" v-for="page in pages" :class="{current: current == page}" class="btn btn-pgn">{{page}}</a>
      <a href="" v-if="hasLast()" @click.prevent="changePage(totalPages)" class="btn btn-pgn btn-last">{{totalPages}}</a>
      <a href="" v-if="hasNext()" @click.prevent="changePage(nextPage)" class="btn btn-pgn">Вперед</a>
    </div>
  </div>
</template>
<script>
export default {
    props:{
        current: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        perPage: {
            type: Number,
            default: 10
        },
        pageRange:{
            type: Number,
            default: 2
        }
    },
    computed:{
        pages(){
          let pages = [];
          for(let i = this.rangeStart; i <= this.rangeEnd; i++){
              pages.push(i);
          }
          return pages;
        },
        rangeStart(){
            let start = this.current - this.pageRange;
            return (start > 1) ? start : 1
        },
        rangeEnd(){
            let end = this.current + this.pageRange;
            return (end < this.totalPages) ? end : this.totalPages
        },
        totalPages(){
          return Math.ceil(this.total / this.perPage);
        },
        nextPage(){
            return this.current + 1;
        },
        prevPage(){
            return this.current - 1;
        },


    },
    methods:{
        hasPrev(){
            return this.current > 1;
        },
        hasNext(){
            return this.current < this.totalPages
        },
        changePage(page){
            this.$emit('page-changed', page);
        },
        hasFirst(){
            return this.rangeStart != 1 && this.total > this.perPage;
        },
        hasLast(){
            return this.rangeEnd < this.totalPages
        }
    }
}
</script>
<style lang="scss">
  .btn{
    &-pgn{
      margin: 5px;
    }
    &-first{
      position: relative;
      margin-right: 30px;
      &:after{
        content: "...";
        position: absolute;
        left: 45px;

      }
    }
    &-last{
      position: relative;
      margin-left: 30px !important;
      &:before{
        content: "...";
        position: absolute;
        right: 45px;
      }
    }
  }
  .current{
    background-color: #aaaaaa !important;
  }
</style>