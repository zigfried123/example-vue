<template>
  <li class="dropdown menu-item regata-item">
    <a class="regata-link" target="_blank" title="Парусная регата FINRACE 2019"  href="https://finrace.ru/?utm_source=leadssu&utm_medium=banner&utm_campaign=navbar_lkv">
      <img src="../../assets/components/navbar/regata/img/logo_white_regate_lkv.png">
    </a>
  </li>
</template>
<style scoped>
  .regata-item{
    display: none;
  }
.regata-link{
  display: block;
  padding: 0px !important;
  padding-top: 5px !important;
}
.regata-link img{
  width: 100px;
  cursor: pointer;
}
  @media screen and (min-device-width: 1330px ) {
    .regata-item{
      display: block;
    }
  }
</style>


