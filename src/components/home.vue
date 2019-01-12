<template>
  <div>
    <div class="search-wrap">
      <div>
        <input type="text" @click="clearSearch" v-model="searchmsg" placeholder="请输入您搜索的内容">
        <button class="search-btn" @click="search">搜索</button>
      </div>
    </div>
    <ul v-if="showGoods.length != 0" class='goods-list-menu'>
      <li class='goods-list' v-for="(item,index) in showGoods" :key="index" :data-set="index">
        <p class='goods-name'>{{ item.name }}</p>
        <img class='goods-cover' :src=item.cover alt="">
        <p class='goods-author'>{{ item.author }}</p>
        <p> {{ item.price }} <span>元</span> </p>
        <button class="add-goods-buycar" @click="addBuycar">添加商品到购物车</button>
      </li>
    </ul>
    <div v-else-if="nogoods" class="null-goods-wrap">
      暂时没有您搜索的内容!
    </div>
    <button class="to-goods-buycar" @click="toBuycar">跳转到购物车</button>
  </div>
</template>

<script>
export default {
  name: 'home',
  path: '/home',
  data () {
    return {
      allGoods: [],
      showGoods: [],
      addsGoods: [],
      searchGoods: [],
      searchmsg: '',
      nogoods: false
    }
  },
  methods: {
    toBuycar () {
      this.$router.push({path:'/buycar'})
    },
    addBuycar (e) {
      let ishas = false
      if (this.addsGoods.length == 0) {
         this.addsGoods.push({
            goodsId: e.path[1].dataset.set,
            goodsname: e.path[1].children[0].innerText,
            goodsauthor: e.path[1].children[2].innerText,
            goodsprice: e.path[1].children[3].innerText,
            goodscount: 1
         })
          alert('添加成功！')
          localStorage.setItem('Buycar-list',JSON.stringify(this.addsGoods))
      } else {
        this.addsGoods.forEach(g => {
          if (g.goodsId == e.path[1].dataset.set) {
            alert('该物品已加入购物车！') 
            ishas = true
          }
        })
        if (!ishas) {
          this.addsGoods.push({
            goodsId: e.path[1].dataset.set,
            goodsname: e.path[1].children[0].innerText,
            goodsauthor: e.path[1].children[2].innerText,
            goodsprice: e.path[1].children[3].innerText,
            goodscount: 1
         })
         alert('添加成功！')
          localStorage.setItem('Buycar-list',JSON.stringify(this.addsGoods))
        }
      }
    },
    search () {
      if (this.searchmsg.length != 0) {
        this.searchGoods = []
        // 获取输入值并将它和所有物品名都大写化（便于检索不区分字母大小写）
        let searchString = this.searchmsg
        this.allGoods.forEach(g => {
          let reg = g.name.toUpperCase()
          // 全部输入字母变为大写
          searchString = searchString.toUpperCase()
          // console.log(reg)
          // console.log(searchString)
          if ( reg.indexOf(searchString) != -1) {
            this.searchGoods.push(g)
          } else {this.nogoods = true}
       })
        this.showGoods = [...this.searchGoods]
      } else if (this.searchmsg.length == 0) {
        this.showGoods = [...this.allGoods]
      }
      console.log(this.showGoods.length)
    },
    clearSearch () {
      this.searchGoods = []
    }
  },
  created () {
    this.axios.get('https://www.easy-mock.com/mock/5c1b0deb48952b7bd6514342/example/lykmobileshopAppdata')
      .then((response) => {
      this.allGoods = response.data
      this.showGoods = [...this.allGoods]
      }).catch(()=>{
      console.log('加载失败')
    })
    if (localStorage.getItem('Buycar-list') === null) {
      this.addsGoods = []
    } else {
      this.addsGoods = JSON.parse(localStorage.getItem('Buycar-list'))
    }
  }
}
</script>

<style lang="less" scope>
  .search-wrap {
    position: relative;
    width: 300px;
    height: 80px;
    text-align: left;
    line-height: 80px;
    border:1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    input {
      width: 200px;
      height: 60px;
      padding-left:10px;
      letter-spacing: 2px;
      border:none;
      outline:none;
    }
    .search-btn {
      position: absolute;
      width: 100px;
      height: 78px;
      right:0;
      border:none;
      outline: none;
      font-size: 20px;
      color:#fff;
      background: rgb(230, 139, 20);
      cursor: pointer;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .search-btn:hover {
      background: rgb(139, 139, 240);
    }
  }
  .goods-list-menu {
    text-align: left;
    list-style: none;
    p {
      width: 300px;
    }
    .goods-list {
      padding: 5px;
      .add-goods-buycar {
        height: 60px;
        width: 200px;
        bottom:0;
        border:none;
        outline: none;
        background: rgb(243, 129, 35);
      }      
      .goods-name {
        font-size: 20px;
        font-weight: bold;
      }
      .goods-cover {
        width: 100px;
      }
    }
  }
  .to-goods-buycar {
    position: fixed;
    height: 60px;
    width: 300px;
    bottom:0;
    border:none;
    outline: none;
    background: lightblue;
  }
</style>
