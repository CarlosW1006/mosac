<template>
   <div class="center-container">
      <v-sheet class="mx-auto"> 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame">
            <h2 class="frame-title">修改密碼</h2> 
            <v-text-field v-model="userid" label="請輸入您的帳號"></v-text-field>
            <v-text-field v-model="password" label="請輸入新的密碼"></v-text-field>
            <v-text-field v-model="npassword" label="請再輸入新密碼"></v-text-field>

            <div class="flex-container">
               <label class="verify-str">2+4=?</label> &nbsp;&nbsp;
               <v-text-field v-model="verifycode" label="請輸入驗證碼"></v-text-field>
            </div>

            <div class="flex-container">
               <a href="#/letmein" class="text-body-2 font-weight-regular">返回登入頁</a>
               <button class="text-body-2 font-weight-regular">重新產生驗證碼</button>
            </div><br>

            <v-btn @click="changeConfirm(userid, password, npassword, verifycode)" block class="mt-2 login-btn"><h3>確認</h3></v-btn>
         </v-form>
      </v-sheet>
   </div>
</template>

<script>
   import { ref, computed } from 'vue';
   import { useWindowWidth } from './winwidth.js';

   export default {
      name: 'changepwdPage',
      setup() { 
         const userid = ref('');
         const password = ref('');
         const npassword = ref('');
         const verifycode = ref('');
         const { windowWidth } = useWindowWidth();

         // 使用 computed 動態計算 sheetWidth
         const sheetWidth = computed(() => {
            return windowWidth.value > 900 ? '400px' : '300px';
         });

         function changeConfirm(userid, password, npassword, verifycode) {
            if(userid == '123' && password == '123' && npassword == password && verifycode == '6') {
               console.log('login success');
               sessionStorage.setItem('session', userid);
            } else {
               console.log('login failed');
            }
         }
         
         return {
            userid,
            password,
            npassword,
            verifycode,
            sheetWidth,
            windowWidth,
            changeConfirm,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/loginStyle.css";
</style>
