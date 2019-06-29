<template>
  <div ref="listwrap" class="lrc-wrap">
    <audio :src="song.url" id="audio"></audio>
    <header>
      <p class="lrc-title">歌词展板</p>
      <button class="hidden-wrap-btn" @click="hiddenlist" v-if="!ishiddenlist">隐藏</button>
      <button class="hidden-wrap-btn" @click="displaylist" v-else>显示</button>
      <div v-if="islrcshow" class="lrc-show-list">
        <div class="lrcbox">
          <!-- <pre ref="lrcpre" :style="{'top':220 - movelong +'px'}">{{lrcdata}}</pre> -->
          <ul ref="lrcpre" :style="{'top':220-movelong+'px'}">
            <li class="lrcshow" :class="{'btylrc':index == linum}" :ref="{'lrcshowli':index == linum}"  v-for="(m,index) in lrcdata" :key="index" :data-set=index>
              <p >{{m}}</p>
            </li>
          </ul>
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
      lrctime: [],
      url: "",
      islrcshow: false,
      movelong: 0,
      ishiddenlist: false,
      linum:0,
      addnum:0
    };
  },
  methods: {
    getlrc() {
      let data;
      this.axios
        .get(
          "https://v1.itooi.cn/netease/lrc?id="+this.song.id
        )
        // 这个地方的箭头函数指向当前this 原始是funciton es5 this指向不同 是个坑
        .then(response => {
          data = response.data;
          let box = [];
          let timebox = [];
          let lrcbox = data.split("[");
          // 获取歌词文字
          lrcbox.forEach(m => {
            box.push(m.slice(m.indexOf("]")+1));
            timebox.push(m.slice(0, m.indexOf("]")));
          });
          box.splice(0,1)
          box.forEach(m=>{
            if (m.length == 1) {
              box.splice(box.indexOf(m),1)
            }
            return box
          })
          this.lrcdata = box;
          // 获取歌词时间树
          this.lrctime = []
          timebox.forEach(m => {
            let num =
              parseFloat(m.slice(1, 2)) * 60 + parseFloat(m.slice(3, 5));
              if (num) {
                this.lrctime.push(parseFloat(num.toFixed(2)));
              }
          });
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
    setTimeout(()=>{
      let audio = document.getElementById("audio");
      if (this.lrctime.length <= this.lrcdata.length) {
       this.addnum =Math.abs(this.lrctime.length - this.lrcdata.length)
      }
      let timer = setInterval(() => {
        let percent = audio.currentTime / this.song.time;
               this.movelong = this.long * percent -10;
        this.lrctime.forEach(m => {
          if (m == Math.floor(parseFloat(audio.currentTime))) {
           this.linum = this.lrctime.indexOf(m) + this.addnum
          }
        });
      }, 250);

      },1000)

      // percent = audio.currentTime / this.song.time;
      // this.movelong = this.long * percent;
    }
  },
  created() {
    this.lrcdata = "加载中";
  },
  updated() {
    this.long = this.$refs.lrcpre.offsetHeight;
  },
  // 实时更新数据
  watch: {
    song() {
      this.lrcdata = {};
      this.addnum = 0;
      this.movelong = 0;
      this.percent = 0;
      this.islrcshow = false;
      this.getlrc();
      this.islrcshow = true;
      this.lrcmove()
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
  transition: 0.7s;
  border-radius: 10px;
  background: #b53f3f;
  .hidden-wrap-btn {
    position: absolute;
    width: 50px;
    height: 30px;
    top: 5px;
    left: 12px;
    line-height: 30px;
    border: none;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    color: #fff;
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
      top: 45%;
      transform: translateY(-50%);
      width: 100%;
      height: 480px;
      overflow-y: scroll;
      background: linear-gradient(
        #b53f3f,
        rgb(82, 2, 2),
        #b53f3f
      ); /* 标准的语法 */
      ul {
        position: fixed;
        width: 100%;
        left: 50%;
        transition: 1s;
        transform: translateX(-50%);
      }
      .lrcshow {
        width: 100%;
        z-index: 10;
          color: rgb(226, 209, 209);

        p {
          width: 100%;
          line-height: 40px;
        }
      }
    }
  }
}
      .btylrc{
        top:50%;
        color:rgb(51, 233, 240);
        background: rgb(172, 14, 41);
        font-size: 20px;
        font-weight: bold;
      }
::-webkit-scrollbar {
  display: none;
}
</style>
