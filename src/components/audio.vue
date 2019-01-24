<template>
  <div class="play-wrap-page">
    <div class="audio-wrap">
      <audio :src="playsong.url" id="audio"></audio>
      <img :src="playsong.pic" alt>
      <p>
        <span class="name">{{playsong.name}}</span>
        <span class="singer">{{playsong.singer}}</span>
      </p>
      <div class="work-wrap">
        <span class="prep-song checksong" @click="playprep" v-if="!checkmusic">上一首</span>
        <span class="prep-song checksong" v-else>上一首</span>
        <button @click="playaudio" v-if="!isplay">播放</button>
        <button @click="pauseaudio" v-else>暂停</button>
        <span class="next-song checksong" @click="playnext" v-if="!checkmusic">下一首</span>
        <span class="next-song checksong" v-else>下一首</span>
      </div>
      <div class="line-wrap">
        <div class="line-song" :style="{'width':width*100+ '%'}"></div>
        <span class="timeshow" v-if="getwidth.search('N')">{{getwidth}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    song: {},
    pageshow: String,
    playlist: String
  },
  data() {
    return {
      isplay: false,
      songprogress: null,
      playsong: {},
      ischange: false,
      width: 0,
      pausewidth: 0,
      checkmusic: false
    };
  },
  methods: {
    getaudio() {
      let audio = document.getElementById("audio");
      console.log("已播放时间" + audio.currentTime);
      console.log("音频长度" + audio.duration);
    },
    playaudio() {
      let audio = document.getElementById("audio");
      this.isplay = true;
      audio.play();
    },
    pauseaudio() {
      let audio = document.getElementById("audio");
      this.isplay = false;
      audio.pause();
    },
    // 下一曲
    playnext() {
      let data;
      if (this.playlist == "mymusic") {
        data = JSON.parse(localStorage.getItem("likemusic"));
      } else if (this.playlist == "tuijianmuisc") {
        data = JSON.parse(localStorage.getItem("musicList"));
      }
      if (data.length == 1) {
        return;
      } else {
        data.forEach(m => {
          if (m.id == this.playsong.id) {
            if (this.playsong.id == data[data.length - 1].id) {
              this.playsong = data[0];
              setTimeout(() => {
                this.playaudio();
              }, 300);
              this.$emit("getmusicSrc", this.playsong, this.playlist);
              return;
            } else {
              this.playsong = data.splice(data.indexOf(m) + 1, 1)[0];
              setTimeout(() => {
                this.playaudio();
              }, 300);
              this.$emit("getmusicSrc", this.playsong, this.playlist);
              return;
            }
          }
        });
      }
    },
    // 上一曲
    playprep() {
      let data;
      if (this.playlist == "mymusic") {
        data = JSON.parse(localStorage.getItem("likemusic"));
      } else if (this.playlist == "tuijianmuisc") {
        data = JSON.parse(localStorage.getItem("musicList"));
      }
      if (data.length == 1) {
        return;
      } else {
        data.forEach(m => {
          if (m.id == this.playsong.id) {
            // 数组后面加下标直接取对象
            if (this.playsong.id == data[data.length - 1].id) {
              this.playsong = data[0];
              setTimeout(() => {
                this.playaudio();
              }, 300);
              this.$emit("getmusicSrc", this.playsong, this.playlist);
              return;
            } else {
              this.playsong = data.splice(data.indexOf(m) - 1, 1)[0];
              setTimeout(() => {
                this.playaudio();
              }, 300);
              this.$emit("getmusicSrc", this.playsong, this.playlist);
              return;
            }
          }
        });
      }
    },
    playmusic(m, playlist) {
      this.$emit("getmusicSrc", m, playlist);
    },
    setprogresswidth() {
      let audio = document.getElementById("audio");
      let timer = setInterval(() => {
        if (this.width >= 1) {
          clearInterval(timer);
          this.playnext()
        } else {
          this.width = audio.currentTime / this.playsong.time;
        }
      }, 100);
    }
  },
  computed: {
    getwidth() {
      let time = this.playsong.time;
      let mins = Math.floor(time / 60);
      let seconds = time - mins * 60;
      let showtime = mins + ":" + seconds;
      return showtime;
    }
  },
  // 监听切歌
  watch: {
    song(val) {
      this.width = 0;
      let song = {};
      song = this.song;
      this.playsong = song;
      setTimeout(() => {
        this.playaudio();
      }, 300);
      this.setprogresswidth();
      localStorage.setItem("playingmusic", JSON.stringify(this.song));
    },
    playsong(val) {
      this.width = 0;
      this.setprogresswidth();
      localStorage.setItem("playingmusic", JSON.stringify(this.playsong));
    }
  }
};
</script>

<style lang="less" scoped>
.play-wrap-page {
  position: fixed;
  z-index: 5;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  .audio-wrap {
    position: relative;
    padding: 10px;
    width: 780px;
    height: 100px;
    text-align: left;
    border-radius: 10px;
    background: rgba(90, 86, 86, 0.842);
    color: #fff;
    img {
      width: 80px;
      border-radius: 50%;
      animation: circle 10s infinite linear;
    }
    p {
      position: absolute;
      display: inline-block;
      top: 10px;
      left: 100px;
    }
    .work-wrap {
      position: absolute;
      width: 240px;
      height: 40px;
      left: 50%;
      bottom: 4px;
      transform: translateX(-50%);
      line-height: 40px;
      text-align: center;
      background: rgba(36, 28, 28, 0.801);
      border-radius: 10px;
      .checksong {
        display: inline-block;
        width: 50px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
      button {
        margin: 0 5px 5px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        background: #ddd;
        border-radius: 5px;
        outline: none;
        border: 1px solid pink;
        color: #fff;
        cursor: pointer;
        background: rgba(250, 38, 38, 0.836);
      }
    }
    .line-wrap {
      position: absolute;
      width: 500px;
      height: 8px;
      top: 42px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 76px;
      background: #a79393;
      .line-song {
        height: 8px;
        border-radius: 20px;
        background: #b53f3f;
      }
      .timeshow {
        display: block;
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
}
@keyframes circle {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
