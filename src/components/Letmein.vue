<template>
   <div class="center-container">
      <v-sheet class="mx-auto" > 
         <p class="sys-title">自我健康管理雲端平台</p>
         <div class="login-frame" @submit.prevent @keyup.enter="sendAuth">
            <h2 class="frame-title">登入</h2> 
            
            <v-text-field v-model="credential" label="請輸入您的帳號" solo>
               <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
               </template>
            </v-text-field>
            
            <v-text-field v-model="password" label="請輸入您的密碼" solo :type="showPassword ? 'text' : 'password'" autocomplete
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="PasswordVisible">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <div class="flex-container-login">
               <label class="verify-frame"><p>{{ verifyCodeArr.verify_num1 }}+{{ verifyCodeArr.verify_num2 }}=?</p></label>
               <v-text-field v-model="verifyAnswer" label="請輸入驗證碼">
               </v-text-field>
            </div>

            <div class="flex-container-login">
               <a href="#/forgotPwd" class="text-body-2 font-weight-regular forgot-pwd">忘記密碼?</a>
               <button class="text-body-2 font-weight-regular change-vcode" @click="callVerify()">重新產生驗證碼</button>
            </div><br>

            <!-- 按鈕點擊觸發 sendAuth -->
            <v-btn @click="sendAuth" block class="mt-2 login-btn">
               <h3>登入</h3>
            </v-btn>
         </div>
      </v-sheet>
   </div>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { askVerify, login } from '@/api/auth';
   // import { generateSHA256Hash } from './JS/encryption.js';

   export default {
      name: 'LetmeinPage',
      setup() { 
         let isLoading = ref(false);
         const credential = ref('');
         const password = ref('');
         const verifyAnswer = ref('');
         const verifyCodeArr = ref('');
         const router = useRouter();
         const showPassword = ref(false);

         // 取得驗證碼資料
         askVerify(verifyCodeArr);

         // 手動取得驗證碼資料
         function callVerify() { 
            askVerify(verifyCodeArr);
         }

         // 調整密碼顯示方式
         function PasswordVisible() {
            showPassword.value = !showPassword.value;

            if (showPassword.value) {
               setTimeout(() => {
                  showPassword.value = false;
               }, 2000);
            }
         }

         // 呼叫 login 傳送使用者登入資料
         function sendAuth() { 
            isLoading.value = true;
            login(credential.value, password.value, verifyCodeArr.value.verify_id, verifyAnswer.value)
            .then(() => {
               isLoading.value = false;
               router.push('/index').then(() => {
                  window.location.reload();
               });
            })
         }

         return {
            password,
            isLoading,
            credential,
            showPassword,
            verifyAnswer,
            verifyCodeArr,
            
            sendAuth,
            callVerify,
            PasswordVisible,
         };
      },
   };

</script>

<style lang="css" scoped>
   @import "../assets/css/loginStyle.css";
</style>
