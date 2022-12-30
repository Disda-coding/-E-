<template>
  <div id="list">
    <ul style="padding-left: 0;margin-top: 0px">
      <li v-for="item in admins" :class="{ active: currentSession?item.username === currentSession.username:false }"
          v-on:click="changecurrentSession(item)"><!--   :class="[item.id === currentSession ? 'active':'']" -->
        <!-- 未读消息提示 小红点  <el-badge is-dot> </el-badge> -->
        <el-badge is-dot :is-dot="idDot[user.username+'#'+item.username]"><img class="avatar" :src="item.userFace"
                                                                               :alt="item.name"></el-badge>
        <p class="name">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'list',

  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')),
      cSession:{
        userFace: '',
        username: ''
      }
    }
  },
  destroyed(){
    // 离开页面触发，防止出现无法接受消息的bug
    // console.log("leave"+this.cSession)
    // if(typeof(this.cSession)!=='undefined'){
    //   this.cSession.username=""
      this.$store.commit('changecurrentSession', this.cSession)
    //   console.log(this.cSession)
    // }
  },
  computed: {
    ...mapState([
      'idDot',
      'admins',
      'currentSession'
    ]),
    ...mapGetters([
      'admins_get',
      'filterkey_get'
    ])
  },
  methods: {
    changecurrentSession: function (currentSession) {
      this.$store.commit('changecurrentSession', currentSession)
    }
  },
  watch: {
    //观察filterkey_get的值，如果发生变化就刷新admin数组
    filterkey_get: function (val) {
      this.getRequest('/chat/admin?keywords=' + val).then(resp => {
        if (resp) {
          this.$store.commit("INIT_ADMINS", resp)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
  li {
    padding: 0 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  li.active { /*注意这个是.不是冒号:*/
    background-color: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }

  .name {
    display: inline-block;
    margin-left: 15px;
  }
}
</style>
