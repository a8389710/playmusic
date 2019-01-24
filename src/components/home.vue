<template>
  <div class="home-page-wrap">
    <header>
      <div class="title-music">
        <span>宇翔云音乐</span>
      </div>
      <ul class="list-menu">
        <li
          v-for="type in typelist"
          :key="type.id"
          @click="changelist($event)"
          :class="{'listbackground':pageshow == type.title}"
        >
          <p class="list-title">{{type.title}}</p>
        </li>
      </ul>
    </header>
    <Discover v-if="pageshow == '发现音乐'" :song=musicsrc v-on:getmusicSrc="getmusicSrc"/>
    <Mymuisc v-else-if="pageshow == '我的音乐'" :song=musicsrc v-on:getmusicSrc="getmusicSrc"/>
    <Audio :song=musicsrc :playlist=playlist v-on:getmusicSrc="getmusicSrc" />
    <Playlist :playlist=playlist  v-on:getmusicSrc="getmusicSrc" :song=musicsrc />
    <Lrc :song=musicsrc />
  </div>
</template>

<script>
import Discover from "./discovermusic";
import Mymuisc from "./mymusic";
import Audio from "./audio";
import Playlist from "./playList";
import Lrc from "./lrc";


export default {
  name: "home",
  components: {
    Discover,
    Mymuisc,
    Audio,
    Playlist,
    Lrc
  },
  data() {
    return {
      typelist: [
        {
          title: "发现音乐"
        },
        {
          title: "我的音乐"
        }
      ],
      pageshow: "发现音乐",
      musicsrc: {},
      playlist:'',
      coming:0
    };
  },
  methods: {
    changelist(e) {
      // e.currentTarget.firstElementChild vue特殊的获取某特定元素值的方法之一
      let title = e.currentTarget.firstElementChild.innerHTML;
      this.pageshow = title;
    },
    // 接收子组件传递过来的音乐url （v-on getmusicSrc：‘getmusicSrc’ 监听传递过来的数据）
    getmusicSrc(m,playlist) {
      this.musicsrc = m;
      this.playlist = playlist
    }
  }
};
</script>

<style lang="less" scoped>
.home-page-wrap {
  position: relative;
  margin-bottom:40px;
}
header {
  width: 100%;
  height: 80px;
  background: rgb(56, 54, 54);
  display: flex;
  justify-content: center;
  line-height: 80px;
  color: #fff;
  .title-music {
    float: left;
    width: 160px;
    margin-right: 20px;
    font-size: 30px;
    font-weight: bold;
  }
  li {
    width: 100px;
    padding: 0 10px;
    float: left;
    cursor: pointer;
    transition: 0.5s;
  }
  li:hover {
    background: rgb(31, 28, 28);
  }
}
.listbackground {
  background: rgb(31, 28, 28);
}

</style>
