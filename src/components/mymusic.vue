<template>
  <div class="mymusic-wrap">
    <section class="music-wrap" v-if="data.length !== 0">
      <ul>
        <li v-for="m in data" :key="m.id">
          <div v-if="m.islike">
            <img :src="m.pic" alt @click="playmusic(m)">
            <p class="name" @click="playmusic(m)">《{{m.name}}》</p>
            <p class="singer">{{m.singer}}</p>
            <span class="play work" @click="playmusic(m,'mymusic')">播放</span>
            <span class="nolike work" @click="notlikeanmore(m)">删除</span>
          </div>
        </li>
      </ul>
    </section>
    <section class="no-music-wrap" v-else>
      <p>嘤嘤嘤暂时没有收藏歌曲 快去欣赏吧！！~~</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "mymusic",
  props: {
    song: Object
  },
  data() {
    return {
      data: [],
      musicsrc: ""
    };
  },
  methods: {
    getdata() {
      let data = JSON.parse(localStorage.getItem("musicList"));
      let showdata = [];
      data.forEach(m => {
        if (m.islike) {
          showdata.push(m);
        }
      });
      this.data = showdata;
      localStorage.setItem("likemusic", JSON.stringify(showdata));
    },
    playmusic(m, playlist) {
      let data = JSON.parse(localStorage.getItem("playingmusic"));
      if (data != null && data.id == m.id) {
        console.log("play");
        return;
      } else {
        this.$emit("getmusicSrc", m, playlist);
      }
    },
    // 取消收藏，对应排行榜展示数据也要进行变化
    notlikeanmore(m) {
      let data = JSON.parse(localStorage.getItem("musicList"));
      let a = confirm("确定取消收藏吗？");
      if (a) {
        data.forEach(n => {
          if (n.id == m.id) {
            n.islike = false;
            return;
          }
        });
        let likedata = JSON.parse(localStorage.getItem("likemusic"));
        likedata.forEach(n => {
          if (m.id == n.id) {
            likedata.splice(likedata.indexOf(n), 1);
            return;
          }
        });
        localStorage.setItem("musicList", JSON.stringify(data));
        localStorage.setItem("likemusic", JSON.stringify(likedata));
        this.data.splice(this.data.indexOf(m), 1);
      }
    }
  },
  created() {
    this.getdata();
  },
  watch: {
    data(val) {
      this.data = val;
    }
  }
};
</script>

<style lang="less" scoped>
.music-wrap {
  ul {
    width: 780px;
    margin: 0 auto;
    li {
      position: relative;
      padding: 10px 0 10px 10px;
      margin-left: 40px;
      margin-top: 10px;
      width: 700px;
      text-align: left;
      background: rgba(145, 138, 138, 0.308);
      img {
        width: 60px;
        cursor: pointer;
        border-radius: 5px;
      }
      p {
        display: inline-block;
        font-size: 12px;
        font-weight: bold;
      }
      .name {
        position: absolute;
        top: 10px;
        cursor: pointer;
      }
      .singer {
        position: absolute;
        top: 30px;
        left: 78px;
      }
      .play {
        position: absolute;
        display: block;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        border-radius: 10px;
        color: #fff;
        background: rgba(212, 116, 102, 0.801);
        top: 50%;
        transform: translateY(-50%);
        right: 150px;
        cursor: pointer;
      }
      .nolike {
        position: absolute;
        display: block;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        border-radius: 10px;
        color: #fff;
        background: rgba(212, 116, 102, 0.801);
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        cursor: pointer;
      }
      .work:hover {
        background: rgb(179, 24, 24);
      }
    }
  }
}
.no-music-wrap {
  position: absolute;
  margin: 0 auto;
  width: 780px;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 20px;
}
</style>

