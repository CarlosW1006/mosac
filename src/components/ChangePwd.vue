<template>
   <div class="center-container">
      <v-sheet class="mx-auto"> 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame">
            <h2 class="frame-title">修改密碼</h2> 
            <v-text-field v-model="userid" label="請輸入您的帳號"></v-text-field>
            <v-text-field v-model="password" label="請輸入新的密碼"></v-text-field>
            <v-text-field v-model="repassword" label="請再輸入新密碼"></v-text-field>

            <div class="flex-container-login">
               <label class="verify-frame"><p>{{ verifyCodeArr.verifyCode_question }}</p></label> &nbsp;&nbsp;
               <v-text-field v-model="verifycode" label="請輸入驗證碼"></v-text-field>
            </div>

            <div class="flex-container-login">
               <a href="#/letmein" class="text-body-2 font-weight-regular">返回登入頁</a>
               <button class="text-body-2 font-weight-regular">重新產生驗證碼</button>
            </div><br>

            <v-btn @click="changeConfirm(userid, password, repassword, verifycode)" block class="mt-2 login-btn"><h3>確認</h3></v-btn>
         </v-form>
      </v-sheet>
   </div>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { getVerifyCode, sendPassword } from './JS/authservice.js';

   export default {
      name: 'changepwdPage',
      setup() { 
         const userid = ref('');
         const password = ref('');
         const repassword = ref('');
         const verifycode = ref('');
         const verifyCodeArr = ref('');
         const router = useRouter();

         // 呼叫 getVerifyCode 取得驗證碼資料
         getVerifyCode(verifyCodeArr);

         // 手動呼叫 getVerifyCode 取得驗證碼資料
         function callVerifyCode() {
            getVerifyCode(verifyCodeArr);
            console.log('call success!!');
         }

         function changeConfirm(userid, password, repassword, verifycode) {
            sendPassword(userid.value, password.value, repassword.value, verifycode.value, verifyCodeArr.value.verifyCode_ans).then(() => {
               router.push('/index').then(() => {
                  window.location.reload();
               });
            })
         }
         
         return {
            userid,
            password,
            repassword,
            verifycode,
            verifyCodeArr,
            changeConfirm,
            callVerifyCode,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/loginStyle.css";
</style>
