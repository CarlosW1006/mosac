<template>
   <div class="center-container">
      <v-sheet class="mx-auto"> 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame" @keyup.enter="changeConfirm">
            <h2 class="frame-title">忘記密碼</h2> 
            <v-text-field v-model="userid" label="請輸入您的帳號" solo>
               <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
               </template>
            </v-text-field>

            <v-text-field v-model="password" label="請輸入新的密碼" solo
            :type="showPassword ? 'text' : 'password'" autocomplete :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePasswordVisibility">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <v-text-field v-model="repassword" label="請再輸入新密碼" solo type="password">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <div class="flex-container-login">
               <label class="verify-frame"><p>{{ verifyCodeArr.verify_num1 }}+{{ verifyCodeArr.verify_num2 }}=?</p></label>
               <v-text-field v-model="verifycode" label="請輸入驗證碼"></v-text-field>
            </div>

            <div class="flex-container-login">
               <a href="#/letmein" class="text-body-2 font-weight-regular forgot-pwd">返回登入頁</a>
               <button class="text-body-2 font-weight-regular change-vcode" @click="callVerify()">重新產生驗證碼</button>
            </div><br>

            <v-btn @click="changeConfirm(credential, password, repassword, verifycode)" block class="mt-2 login-btn"><h3>確認</h3></v-btn>
         </v-form>
      </v-sheet>
   </div>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   // import { generateSHA256Hash } from './JS/encryption.js';
   import { sendPassword } from './JS/authservice.js';
   import { askVerify } from '@/api/auth';

   export default {
      name: 'forgotpwdPage',
      setup() { 
         const userid = ref('');
         const password = ref('');
         const repassword = ref('');
         const verifycode = ref('');
         const verifyCodeArr = ref('');

         const showPassword = ref(false);
         const router = useRouter();

         // 取得驗證碼資料
         askVerify(verifyCodeArr);

         // 手動取得驗證碼資料
         function callVerify() {
            askVerify(verifyCodeArr);
            console.log('call success!!');
         }

         // 調整密碼顯示方式
         function togglePasswordVisibility() {
            showPassword.value = !showPassword.value;
         }

         function changeConfirm() {
            sendPassword(userid.value, password.value, repassword.value, verifycode.value, verifyCodeArr.value.verifyCode_ans)
            .then(() => {
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
            showPassword,

            callVerify,
            changeConfirm,
            togglePasswordVisibility,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/loginStyle.css";
</style>
