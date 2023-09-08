<template>
    <div class="modal hide fade">
        <div class="modal-header">
            <slot name="header"></slot>
        </div>
        <div class="modal-body">
            <slot name="body"></slot>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Закрыть</a>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'modal',
    data(){
        return {
          'states' :  {
            'open': false,
          }
        };
    },
    methods: {

    },
    updated() {
      let vm = this;
      $(this.$el).on('shown', function () {
        vm.open = true;
        vm.$emit('show');
      }).on('hidden', function () {
        vm.open = false;
        vm.$emit('hide');
      });
    }
  };
</script>
<style scoped>
    .modal-body {
        max-height: none !important;
        background-color: rgba(0, 110, 255, 0.04);
    }
</style>