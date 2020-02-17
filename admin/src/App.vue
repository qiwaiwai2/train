<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './style/common.scss';
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.slidergoBack{
    .ant-breadcrumb-separator{
        display: none !important
    }
}
.ant-table-thead > tr > th{
  background: #F7FBFF !important;
}
.ant-upload-list{
  display: inline-block;
  float: left;
}
.ant-upload-list-item{
  margin-top: 20px !important
}
</style>
