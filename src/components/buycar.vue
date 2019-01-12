<template>
  <div>
    <div v-if="buycarDate.length == 0">空</div>
    <div v-else class="goods-wrap">
      <ul  class='goods-list-menu'>
        <li class='goods-list' v-for="(item,index) in buycarDate" :key="item.goodsId">
          <input type="checkbox" class="checked-button" :checked="readyPayGoods.indexOf(item) != -1" @click="checkOne(index,item)"><span>选中</span>
          <p class='goods-name'>{{ item.goodsname }}</p>
          <p class='goods-author'>{{ item.goodsauthor }}</p>
          <p> {{ item.goodsprice }}</p>
          <div class="count-btn-wrap">
            <span class="addGoods btn-span" @click="relCount(index)">-</span>
            <input class="goods-count" type="number" style="width:50px;textAlign:center" v-model="item.goodscount" readonly>
            <span class="delGoods btn-span" @click="addCount(index)">+</span>
          </div>
          <p>单品总价： {{goodsTotal(item.goodsprice,item.goodscount)}}元</p>
          <span class="delete-span" @click="deleteGoods(index,item)" :data-set="index">删除</span>
        </li>
      </ul>
      <footer>
        <input type="checkbox" :checked="readyPayGoods.length == buycarDate.length" @click="checkAll"><span>全选</span>
        <p>所选商品总数： {{ getGoodsAllCount }}件</p>
        <p>所选商品总价： {{ getTotal }}元</p>
        <p v-for="g in readyPayGoods" :key="g.id">
          <span>已勾选商品 {{ g.goodsname}} 数量: {{ g.goodscount }}</span>
        </p>
      </footer>

    </div>
  </div>
</template>

<script>
export default {
  name: 'buycar',
  data () {
    return {
      buycarDate: [],
      readyPayGoods: [],
      goodsAllCount: null,
      Total: null,
      checkbox: 0,
      isCheckedAll: false
    }
  },
  methods : {
    // 删除
    deleteGoods (idx,item) {
      let a = confirm('确认删除？')
      let newcheckbox = []
      if (a) {
        this.buycarDate.splice(idx,1)
        if (this.readyPayGoods.indexOf(item) != -1) {
          this.readyPayGoods.splice(this.readyPayGoods.indexOf(item),1)
        }
        // 判断点击未选中的货物删除之后如何重置待付款货物 ！！！
        // localStorage.setItem('Buycar-list',JSON.stringify(this.buycarDate))
      }
    },
    addCount (n) {
      this.buycarDate[n].goodscount ++
      // 若库存有限 设定上限值
    },
    relCount (n) {
      // 如果只有一件减冬瓜皮
      if (this.buycarDate[n].goodscount == 1) {
        return
      }
      this.buycarDate[n].goodscount --
    },
    goodsTotal (n,m) {
      let price = parseFloat(n.slice(0,-1))
      let total = (price * parseFloat(m))
      return total.toFixed(2)
    },
    // 全选
    checkAll () {
      // 如果全部单选框都没有选中
      if (this.isCheckedAll == false) {
        this.isCheckedAll = true
        this.readyPayGoods = []
        this.checkbox = []
        // 防止数组同源
        this.readyPayGoods = [...this.buycarDate]
      } else {
        this.isCheckedAll = false
        this.readyPayGoods = []
        this.checkbox = 0
      }
    },
    // 单选
    checkOne (idx,item) {
      // 只要indexOf的值不是-1 说明数组中已经有某个东西 便于操作
      if (this.readyPayGoods.indexOf(item) == -1) {
        this.checkbox = this.checkbox+1
        this.readyPayGoods.push(this.buycarDate[idx])
        if (this.checkbox == this.buycarDate.length) {
          this.isCheckedAll = true
        }
      } else {
        this.checkbox = this.checkbox - 1
        // 匹配到待付款物品的下标，进行操作
        this.readyPayGoods.splice(this.readyPayGoods.indexOf(item),1)
        this.isCheckedAll = false
      }
    }
  },
  computed : {
    getGoodsAllCount () {
      let allCounts = 0
      this.readyPayGoods.forEach(g => {
        allCounts += g.goodscount
      })
      return allCounts
    },
    getTotal () {
      let price = 0
      this.readyPayGoods.forEach(g => {
        price += parseFloat(g.goodscount) * parseFloat(g.goodsprice.slice(0,-1))
      })
      return price.toFixed(2)
    }
  },
  created () {
    // 实际操作应该也是获取用户的个人信息一类api
    if (localStorage.getItem('Buycar-list') == null) {
      this.buycarDate = []
    } else {
        this.buycarDate = JSON.parse(localStorage.getItem('Buycar-list'))
    }
  }
}
</script>

<style lang="less" scoped>
div {
  text-align: left;
}
.goods-list {
  position: relative;
  padding: 10px;
  width: 500px;
  .goods-name {
    color:orange;
  }
  .count-btn-wrap {
    display: flex;
      .goods-count {
        position: relative;
        display: block;
        height: 30px;
    }
      .btn-span {
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid black;
    }
  }

  .delete-span {
    position: absolute;
    display: block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    right: 10px;
    top:50%;
    transform: translateY(-50%);
    z-index: 10;
    text-align: center;
    color:#fff;
    background: red;
    cursor: pointer;
  }
}
footer {
  position: fixed;
  width: 100%;
  bottom:0;
  background: pink;
  z-index: 11;
}
ul {
  margin-bottom:500px;
}
</style>


