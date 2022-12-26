<template>
  <div id="message" v-scroll-bottom="sessions">
    <ul v-if="currentSession">
      <li v-for="entry in sessions[user.username+'#'+currentSession.username]">
        <p class="time">
          <span>{{ entry.date | time }}</span>
        </p>
        <div class="main" :class="{self:entry.self}">
          <img class="avatar" :src="entry.self ? user.userFace:currentSession.userFace" alt="">
          <p class="row-2">{{ entry.content }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'message',
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')), // 当前用户
    }
  },
  computed: mapState([
    'sessions',
    'currentSession'
  ]),
  filters: {
    time(date) {
      if (date) {
        date = new Date(date);
      }
      return `${date.getHours()}:${date.getMinutes()}`;
    }
  },
  directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    'scroll-bottom'(el) {
      //console.log(el.scrollTop);
      setTimeout(function () {
        el.scrollTop += 9999;
      }, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
#message {
  padding: 15px;
  max-height: 68%;
  overflow-y: scroll;

  ul {
    list-style-type: none;
    padding-left: 0;

    li {
      margin-bottom: 15px;
    }
  }

  .time {
    text-align: center;
    margin: 7px 0;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #FFF;
      background-color: #dcdcdc;
      border-radius: 2px;
    }
  }

  .main {
    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
      width: 30px;
      height: 30px;

    }
    .row-2{
      max-width: 80%;
      display: inline-block;
      margin-top: 0px;
      padding: 0 10px;
      background-color: #fafafa;
      border-radius: 4px;
      line-height: 30px;
      position: relative;
      text-align: center;
    }
    .row-2::before{
      display: inline-block;
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      top: 5px;
      left: -3px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 6px solid #fafafa;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 80%;
      background-color: #fafafa;
      border-radius: 4px;
      line-height: 30px;
    }
  }

  .self {
    text-align: right;
    .row-2::before{
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 6px solid transparent;
    }
    .row-2{
      max-width: 80%;
      display: inline-block;
      margin-top: 0px;
      padding: 0 10px;
      //max-width: 80%;
      background-color: #b2e281;
      border-radius: 4px;
      line-height: 30px;
      position: relative;
      text-align: center;
    }
    .row-2::after{
      display: inline-block;
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      /* 箭头靠右边 */
      top: 5px;
      right: -3px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #b2e281;
      /* 箭头靠下边 */
      /* left: 25px;
      bottom: -10px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid teal; */
      /* 箭头靠左边 */
      /* top: 13px;
      left: -10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid teal; */
      /* 箭头靠下边 */
      /* top: -10px;
      left: 25px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid teal; */
    }
    .avatar {
      float: right;
      margin: 0 0 0 10px;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }

    //.text {
    //  display: inline-block;
    //  margin-top: 0px;
    //  padding: 0 10px;
    //  max-width: 80%;
    //  background-color: #b2e281;
    //  border-radius: 4px;
    //  line-height: 30px;
    //
    //}
  }
}
</style>
