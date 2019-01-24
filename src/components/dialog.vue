<template>
  <div class="dialog-wrap" v-if="isshow">
    <div>
      <p>添加成功</p>
    </div>
  </div>
</template>
<script>
export default {
  props: { isshow: Boolean },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.dialog-wrap {
  position: fixed;
  width: 180px;
  height: 180px;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: rgba(63, 60, 60, 0.9);
  border-radius: 20px;
  text-align: center;
  line-height: 180px;
  animation: dialoghid 0.5s forwards;
  p {
    color: #ddd;
    font-size: 24px;
    text-align: center;
  }
}
@keyframes dialoghid {
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
