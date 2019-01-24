<template>
  <div ref="listwrap" class="lrc-wrap">
    <audio :src="song.url" id="audio"></audio>
    <header>
      <p class="lrc-title">歌词展板</p>
      <button class="hidden-wrap-btn" @click="hiddenlist" v-if="!ishiddenlist">隐藏</button>
      <button class="hidden-wrap-btn" @click="displaylist" v-else>显示</button>
      <div v-if="islrcshow" class="lrc-show-list">
        <div class="lrcbox">
          <pre ref="lrcpre" :style="{'top':220 - movelong +'px'}">{{lrcdata}}</pre>
        </div>
      </div>
      <div v-else>
        <p>暂无歌词</p>
      </div>
    </header>
  </div>
</template>
<script>
export default {
  props: {
    song: {}
  },
  data() {
    return {
      lrcdata: {},
      url: "",
      islrcshow: false,
      height: 0,
      movelong: 0,
      long: 0,
      ishiddenlist: false
    };
  },
  methods: {
    geturl() {
      this.url = this.song.lrc;
    },
    getlrc() {
      let data;
      this.axios
        .get(this.url)
        // 这个地方的箭头函数指向当前this 原始是funciton es5 this指向不同 是个坑
        .then(response => {
          data = response.data;
          this.lrcdata = data;
          //将api数据暂时存入本地
        })
        .catch(error => {
          console.log(error);
        });
    },
    hiddenlist(e) {
      e.target.parentElement.parentElement.style.right = "-" + "23.2" + "%";
      this.ishiddenlist = !this.ishiddenlist;
    },
    displaylist(e) {
      //e.target 和 refs 是一个意思哈
      e.target.parentElement.parentElement.style.right = "5" + "px";
      this.ishiddenlist = !this.ishiddenlist;
    },
    lrcmove() {
      let audio = document.getElementById("audio");
      let percent = 0;
      let timer = setInterval(() => {
        if (percent >= 1) {
          clearInterval(timer);
        } else {
          percent = audio.currentTime / this.song.time;
          this.movelong = this.long * percent;
        }
      }, 100);
    }
  },
  created() {
    this.lrcdata = "加载中";
  },
  // 实时更新数据
  updated() {
    this.long = this.$refs.lrcpre.offsetHeight;
  },
  watch: {
    song() {
      this.percent = 0;
      this.islrcshow = false;
      this.geturl();
      this.getlrc();
      this.islrcshow = true;
      this.lrcmove();
    }
  }
};
</script>

<style lang="less" scoped>
.lrc-wrap {
  position: fixed;
  display: block;
  width: 27%;
  height: 760px;
  overflow-y: scroll;
  top: 134px;
  right: 5px;
  transition: .7s;
  border-radius: 10px;
  background: #b53f3f;
  .hidden-wrap-btn{
    position: absolute;
    width: 50px;
    height: 30px;
    top:5px;
    left:12px;
    line-height: 30px;
    border:none;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    color:#fff;
    background: #b53f3f;
  }
  .lrc-title {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    background: #dddddd;
  }
  .lrc-show-list {
    position: relative;
    width: 100%;
    height: 720px;
    .lrcbox {
      position: absolute;
      overflow: hidden;
      top: 45%;
      transform: translateY(-50%);
      width: 100%;
      height: 480px;
      background: linear-gradient(
        #b53f3f,
        rgb(82, 2, 2),
        #b53f3f
      ); /* 标准的语法 */
      pre {
        position: absolute;
        display: block;
        width: 90%;
        line-height: 40px;
        top: 220px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: rgb(255, 255, 255);
        font-size: 12px;
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
