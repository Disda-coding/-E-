<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/*解决填不满的问题*/
/*也可以在index里面改*/
#app{
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  background-color: #f5f5f7;
}
*{
  font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
}
</style>
