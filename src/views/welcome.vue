<template>
  <div class="loader">
    <div class="pacman">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  ready () {
    $('#J-start-loading').remove();
    if(localStorage.token){
        let storageRouteName = localStorage.routeName,
            routerGo = '/departmentEmployee';

            if(storageRouteName && storageRouteName != 'welcome' && storageRouteName != 'login'){
                routerGo = `/${storageRouteName}`;
            }
        this.$route.router.go({path: routerGo, replace: true});
        this.$emit('global', 'PB_LOGIN_IN'); // 每次广播事件
    }else{
        console.log('Go Login')
        this.$route.router.go({path: '/login', replace: true})
    }
  }
}
</script> 
