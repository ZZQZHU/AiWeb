<template>
  <div class="temtotal">
    <div class="temHeader">
    <div class="temHeaderitem">
      <Navigation :mainid="1"> </Navigation>
    </div>
  </div>

  <div class="temmainbody">
    <div class="temtopnav">
      <div class="temtopitem"></div>
    </div>
    <div class="temleftnav">
      <div class="temleftitem" style="height: 350px;"></div>
      <div class="temleftitem" style="height: 150px;"></div>
    </div>

    <div class="temcontainbody">
        <div class="mainCom temcontainitem"  style="height: 3500px;">
            <div style="background-color: beige;"></div>
        </div>

        <div class="temcontainitem"  style="height: 300px;">
            <div style="background-color: red;"></div>
        </div>
    </div>


    <div class="temrightbox">
        <div class="temrightitem" style="height: 150px;"></div>
        <div class="temrightitem" style="height: 550px;position: sticky;top: 100px;"></div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import Navigation from "../components/mainheader.vue";


// 判断


</script>



<style scoped>
/* 引入外部css */
@import "../style.css";

</style>
