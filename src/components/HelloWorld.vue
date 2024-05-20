<script setup>
</script>

<template>
  <div class="mb-4">
    <el-button>default</el-button>
    <el-button type="primary">primary</el-button>
    <el-button type="success">success</el-button>
    <el-button type="info">info</el-button>
    <el-button type="warning">warning</el-button>
    <el-button type="danger">danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button plain>default</el-button>
    <el-button type="primary" plain>primary</el-button>
    <el-button type="success" plain>success</el-button>
    <el-button type="info" plain>info</el-button>
    <el-button type="warning" plain>warning</el-button>
    <el-button type="danger" plain>danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button round>default</el-button>
    <el-button type="primary" round>primary</el-button>
    <el-button type="success" round>success</el-button>
    <el-button type="info" round>info</el-button>
    <el-button type="warning" round>warning</el-button>
    <el-button type="danger" round>danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button :icon="Search" circle></el-button>
    <el-button :icon="Edit" type="primary" circle></el-button>
    <el-button :icon="Check" type="success" circle></el-button>
    <el-button :icon="Delete" type="info" circle></el-button>
    <el-button :icon="Star" type="warning" circle></el-button>
    <el-button :icon="Message" type="danger" circle></el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button link>default</el-button>
    <el-button link type="primary">primary</el-button>
    <el-button link type="success">success</el-button>
    <el-button link type="info">info</el-button>
    <el-button link type="warning">warning</el-button>
    <el-button link type="danger">danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button text>default</el-button>
    <el-button text type="primary">primary</el-button>
    <el-button text type="success">success</el-button>
    <el-button text type="info">info</el-button>
    <el-button text type="warning">warning</el-button>
    <el-button text type="danger">danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button text bg>default</el-button>
    <el-button text bg type="primary">primary</el-button>
    <el-button text bg type="success">success</el-button>
    <el-button text bg type="info">info</el-button>
    <el-button text bg type="warning">warning</el-button>
    <el-button text bg type="danger">danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button :icon="Search">default</el-button>
    <el-button :icon="Check" type="primary">primary</el-button>
    <el-button :icon="Delete" type="success">success</el-button>
    <el-button :icon="Edit" type="info">info</el-button>
    <el-button :icon="Message" type="warning">warning</el-button>
    <el-button :icon="Star" type="danger">danger</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button-group class="mb-4" type="success">
      <el-button :icon="ArrowLeft">上一页</el-button>
      <el-button :icon="ArrowRight">下一页</el-button>
    </el-button-group>
    &nbsp;&nbsp;
    <el-button-group class="mb-4" type="primary">
      <el-button :icon="Edit"></el-button>
      <el-button :icon="Share"></el-button>
      <el-button :icon="Delete"></el-button>
    </el-button-group>
  </div>
  <br />
  <div class="mb-4">
    <el-button loading type="primary">loading</el-button>&nbsp;&nbsp;
    <el-button :loading-icon="Eleme" loading type="primary">loading</el-button>
  </div>
  <br />
  <div class="mb-4">
    <el-button size="small" type="primary">primary</el-button>
    <el-button type="primary">success</el-button>
    <el-button size="large" type="primary">info</el-button>
  </div>
  <br />
  <div>
    <el-button color="#23AFAF" :dark="isDark">Default</el-button>
    <el-button color="#626aef" :dark="isDark" plain>Plain</el-button>

    <el-button color="#626aef" :dark="isDark" disabled>Disabled</el-button>
    <el-button color="#626aef" :dark="isDark" disabled plain>
      Disabled Plain
    </el-button>
  </div>
</template>

<style scoped></style>
