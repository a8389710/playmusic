<template>
    <div ref="listwrap" class="playlist-wrap">
      <div>
        <button class="hidden-wrap-btn" @click="hiddenlist" v-if="!ishiddenlist">隐藏</button>
        <button class="hidden-wrap-btn" @click="displaylist" v-else>显示</button>
        <p class="play-title">歌曲列表</p>
      </div>
      <ul v-if="playlist">
        <li v-for="m in musicList" :key="m.id">
          <img :src="m.pic" alt>
          <p class="name">{{m.name}}</p>
          <p class="singer">{{m.singer}}</p>
          <span class="play" @click="playmusic(m,playlist)" v-if="song.id != m.id && !ishiddenlist">播放</span>
          <span class="play playing" v-else-if="song.id == m.id">播放中</span>
          <span class="play playnamelist" @click="playmusic(m,playlist)" v-else-if="ishiddenlist">{{m.name}}</span>
        </li>
      </ul>
      <div v-else>
        <p>暂无歌曲</p>
      </div>
    </div>
</template>

<script>


export default {
  props: {
    playlist: String,
    song: Object,
    listitemchange:Object
  },
  data() {
    return {
      musicList: [],
      ishiddenlist:false
    };
  },
  methods: {
    playmusic(m, playlist) {
      let data = JSON.parse(localStorage.getItem("playingmusic"));
      if (data != null && data.id == m.id) {
        console.log("play");
        return;
      } else {
        this.$emit("getmusicSrc", m, playlist);
      }
    },
    hiddenlist(e) {
      this.$refs.listwrap.style.left = '-'+'22.5'+'%'
      this.ishiddenlist = !this.ishiddenlist
    },
    displaylist(e){
      //e.target 和 refs 是一个意思哈
      this.$refs.listwrap.style.left  = '5'+'px'
      this.ishiddenlist = !this.ishiddenlist
    },
    //获取当前播放歌曲的列表 根据不同种类判断
    getshowlist () {
      if (this.playlist == "alllist") {
        this.musicList = JSON.parse(localStorage.getItem("musicList"));
      } else if (this.playlist == "likelist") {
        console.log('likelist')
        this.musicList = JSON.parse(localStorage.getItem('likelist'))
      } else if (this.playlist == "tuijianlist") {
        this.musicList = JSON.parse(localStorage.getItem('tuijianlist'))
      }
    }
  },
  watch: {
    song(val) {
      this.getshowlist()
    },
    listitemchange(){
      if (this.listitemchange == null)
      {} else {
        this.getshowlist()
      } 
    }
  }
};
</script>

<style lang="less" scoped>
.playlist-wrap {
  position: fixed;
  min-width: 350px;
  width: 28%;
  height: 760px;
  left: 5px;
  transition: .7s;
  border-radius: 10px;
  top:134px;
  background: #ddd;
  overflow-y: scroll;
  box-shadow: 0 3px 5px rgba(121, 118, 118, 0.473);
  .play-title {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
  }
  .hidden-wrap-btn{
    position: absolute;
    width: 50px;
    height: 30px;
    top:5px;
    right:3px;
    line-height: 30px;
    border:none;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    color:#fff;
    background: #b53f3f;
  }
  li {
    position: relative;
    padding: 10px;
    height: 50px;
    text-align: left;
    color: #fff;
    background: rgba(116, 112, 112, 0.836);
    img {
      width: 30px;
    }
    p {
      position: absolute;
      display: inline-block;
      width: 100px;
      top: 50%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      transform: translateY(-50%);
      font-size: 12px;
      line-height: 30px;
    }
    .name {
      left: 30%;
    }
    .singer {
      left: 60%;
    }
    .like-btn{
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      right:60px;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .play {
      position: absolute;
      display: block;
      font-size: 12px;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .playing {
      width: 50px;
      height: 30px;
      text-align: center;
      right: 5px;
      line-height: 30px;
      border-radius: 10px;
      background: #b53f3f;
      color: #fff;
      font-weight: bold;
    }
    .playnamelist{
      text-align:right;
      width: 60px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  li:nth-child(2n-1) {
    background: rgba(129, 126, 126, 0.753);
  }
}
.hiddenlist {
  animation: hiddenlist .7s linear forwards;
}
.displaylist {
  animation: hiddenlist .7s linear forwards;
}
@keyframes hiddenlist {
  0%{
    left:0
  }
  100%{
    left:-25%
  }
}
@keyframes displaylist {
  0%{
    left:-25%
  }
  100%{
    left:0%
  }
}
</style>
