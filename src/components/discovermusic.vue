<template>
  <div class="discover-wrap">
    <header>
      <ul class="list-menu">
        <li v-for="type in typelist" :key="type.id" @click="changelist($event)">
          <p class="list-title" :class="{'listbackground':chosedlist == type.title}">{{type.title}}</p>
        </li>
      </ul>
    </header>
    <section>
      <ul class="tuijian-menu" v-if="chosedlist == '推荐'">
        <li class="music-list" v-for="m in showdata" :key="m.id">
          <img :src=m.pic alt='图片加载失败' @click="playmusic(m,'tuijianlist')">
          <p @click="playmusic(m,'tuijianlist')">
            <span>{{m.name}}</span>
            <span>{{m.singer}}</span>
          </p>
        </li>
      </ul>
      <ul class="paihangbang-menu" v-else-if="chosedlist == '全部'">
        <li class="music-list" v-for="(m,index) in showdata" :key="m.id">
          <!-- <img :src=m.pic alt="" @click="playmusic(m.url)"> -->
          <p>
            <span class="xuhao">{{index+1}}</span>
            <span class="name" @click="playmusic(m,'alllist')">{{m.name}}</span>
            <span class="singer">{{m.singer}}</span>
          </p>
          <div class="userworking-wraps">
            <img class="like" src='../assets/unlike.png' @click="likemusic(m)" v-if="!m.islike">
            <img class="like red" src='../assets/like.png' @click="notlikemusic(m)" v-else>
            <span  class="down" download="" @click="downmusic">下载</span>
          </div>
        </li>
      </ul>
    </section>
    <Dialog :isshow="opendialog" v-if="opendialog"/>
  </div>
</template>

<script>
import Dialog from "./dialog.vue";

export default {
  name: "discover",
  props: {
    song: Object
  },
  components: {
    Dialog
  },
  data() {
    return {
      data: [{}],
      showdata: [{}],
      typelist: [
        {
          title: "推荐"
        },
        {
          title: "全部"
        }
      ],
      chosedlist: "推荐",
      musicsrc: "",
      opendialog: false
    };
  },
  methods: {
    changelist(e) {
      // e.currentTarget.firstElementChild vue特殊的获取某特定元素值的方法之一
      let title = e.currentTarget.firstElementChild.innerHTML;
      //利用replace去除获取的信息中包含的空格（出现空格的原因是因为代码编写的时候选择了空格 innerHTML 会把空格一并带出）
      this.chosedlist = title.replace(/\s*/g, "");
    },
    // 发现音乐
    getdata() {
      if (localStorage.getItem("musicList") === null) {
        this.axios
          .get(
            "https://api.bzqll.com/music/netease/songList?key=579621905&id=3778678&limit=10&offset=0"
          )
          .then(response => {
            console.log(response);
            //将api数据暂时存入本地
            let allmusic = response.data.data.songs;
            allmusic.forEach(m => {
              m.islike = false;
            });
            localStorage.setItem("musicList", JSON.stringify(allmusic));
            this.data = allmusic
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.data = JSON.parse(localStorage.getItem("musicList"));
      }
    },
    getshowdata () {
      let num = Math.floor((Math.random())*100)
      let box = []
      box = [...this.data]
      this.showdata = box.splice(num,44)
      if (localStorage.getItem('playingmusic') == null) {
        localStorage.setItem('playingmusic',JSON.stringify(""))
      }
    },
    //将子组件的音乐music 通过emit 方式传递给 父组件的播放器（父组件播放器好定位）
    playmusic(m, playlist) {
      let data
      //判断是否第一次进来 是否有播放歌曲
      JSON.parse(localStorage.getItem("playingmusic")) == ""? this.$emit("getmusicSrc", m, playlist)||localStorage.setItem('tuijianlist',JSON.stringify(this.showdata)):data = JSON.parse(localStorage.getItem("playingmusic"))
      // let data = JSON.parse(localStorage.getItem("playingmusic"));
      if (data != null && data.id == m.id) {
        console.log("play");
        return;
      } else {
        this.$emit("getmusicSrc", m, playlist);
        localStorage.setItem('tuijianlist',JSON.stringify(this.showdata))
      }
    },
    // 点击喜欢按钮，将对应歌曲添加到我的音乐列表
    likemusic(item) {
      let like = item;
      like.islike = true;
      let data = JSON.parse(localStorage.getItem("musicList"));
      data.forEach(m => {
        if (m.id == item.id) {
          m.islike = true;
        }
      });
      localStorage.setItem("musicList", JSON.stringify(data));
      this.opendialog = true;
      let timer = setTimeout(() => {
        this.opendialog = false;
      }, 500);
      if (this.opendialog == false) {
        clearInterval(timer);
      }
    },
    notlikemusic(item) {
      let like = item;
      like.islike = false;
      let data = JSON.parse(localStorage.getItem("musicList"));
      data.forEach(m => {
        if (m.id == item.id) {
          m.islike = false;
        }
      });
      localStorage.setItem("musicList", JSON.stringify(data));
    },
    downmusic () {
      alert('没有资源')
    }
  },
  created() {
    this.getdata();
    this.getshowdata()
    console.log('刷新了dicover组件')
  },
  //监听列表栏的变化，便于加载对应数据
  watch: {
    chosedlist(val) {
      if (val == "全部") {
        this.showdata = [...this.data];
      } else if (val == "推荐") {
      this.getshowdata()
      }
    },
    opendialog(val) {
      if (val) {
        setTimeout(() => {
          val = false;
        }, 4000);
      }
    },
    data() {
      this.data = this.data;
      this.getshowdata()
    }
  }
};
</script>

<style lang="less" scoped>
.discover-wrap {
  position: relative;
  header {
    padding: 4px 0;
    margin-top: 5px;
    width: 100%;
    height: 30px;
    background: rgb(190, 22, 22);
    display: flex;
    justify-content: center;
    line-height: 22px;
    color: #fff;
    .title-music {
      float: left;
      width: 160px;
      margin-right: 20px;
      font-size: 30px;
      font-weight: bold;
    }
    li {
      float: left;
      width: 90px;
      height: 20px;
      font-size: 14px;
      transition: 0.5s;
      cursor: pointer;
      .list-title {
        border-radius: 12px;
        width: 70%;
        transition: 0.5s;
      }
    }
    li p:hover {
      background: rgb(139, 7, 7);
    }
  }
  .listbackground {
    background: rgb(139, 7, 7);
  }
  section {
    ul {
      margin: 0 auto;
      width: 775px;
      height: auto;
    }
    .tuijian-menu {
      .music-list {
        float: left;
        padding: 10px 0 0 20px;
        margin-top:20px;
        width: 190px;
        height: 220px;
        text-align: center;
        transition: 0.3s;
        img {
          width: 150px;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(138, 132, 132, 0.678);
          cursor: pointer;
          transition: 5s;
          transform: initial;
        }
        p {
          margin-top: 10px;
          height: 40px;
          line-height: 40px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          text-align: center;
          font-weight: bold;
          transition: .3s;
        }
      }
      .music-list:hover {
      
        p {
          transform: scale(1.2);
          text-shadow: 0 8px 8px rgba(97, 91, 91, 0.425);
          font-size: 15px;
        }
        img {
          box-shadow: 0 0 30px rgb(226, 41, 17);
          animation: circle1 3s infinite linear forwards  ;
        }
        @keyframes circle1 {
          100%{
            transform: rotateZ(360deg) ;
          }
        }
      }
    }
    .paihangbang-menu {
      li {
        position: relative;
        padding-left: 10px;
        width: 780px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        background: rgba(224, 226, 226, 0.466);
        transition: 0.3s;
        p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          span {
            display: inline-block;
          }
          .xuhao {
            width: 50px;
            font-weight: bold;
            color: rgba(255, 2, 2, 0.877);
          }
          .name {
            margin-left: 80px;
            width: 180px;
            font-size: 12px;
            font-weight: bold;
            color: rgb(2, 2, 2);
            cursor: pointer;
          }
          .singer {
            margin-left: 50px;
            font-size: 12px;
          }
        }
        .userworking-wraps {
          position: absolute;
          text-align: center;
          width: 200px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          span {
            margin: 0 10px;
            cursor: pointer;
          }
          .like {
            width: 20px;
            cursor: pointer;
          }
          .down {
            position: absolute;
            right: 10px;
          }
        }
      }
      li:nth-child(2n-1) {
        background: rgb(212, 210, 210);
      }
      li:hover {
        background: rgb(155, 153, 153);
      }
    }
  }
}
</style>

