<template>
    <div>
        <router-view :contHeight="contHeight"></router-view>
    </div>
</template>
<script>
    export default{
        props:['contHeight'],
    }
</script>
<style lang="scss" scoped>

</style>