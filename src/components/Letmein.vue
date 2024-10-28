<template>
   <div class="center-container">
      <v-sheet class="mx-auto" > 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame" @submit.prevent>
            <h2 class="frame-title">登入</h2> 
            
            <!-- 用 @keydown.enter 監聽 Enter 鍵 -->
            <v-text-field 
               v-model="userid" 
               label="請輸入您的帳號" 
               @keydown.enter="callAuthFunc(userid, password, verifycode)"
            ></v-text-field>
            
            <v-text-field 
               v-model="password" 
               label="請輸入您的密碼" 
               @keydown.enter="callAuthFunc(userid, password, verifycode)"
            ></v-text-field>

            <div class="flex-container-login">
               <label class="verify-frame"><p>{{ verifyCodeArr.verifyCode_question }}</p></label> &nbsp;&nbsp;
               <v-text-field 
                  v-model="verifycode" 
                  label="請輸入驗證碼" 
                  @keydown.enter="callAuthFunc(userid, password, verifycode)"
               ></v-text-field>
            </div>

            <div class="flex-container-login">
               <a href="#/changePwd" class="text-body-2 font-weight-regular">忘記密碼?</a>
               <button class="text-body-2 font-weight-regular" @click="callVerifyCode()">重新產生驗證碼</button>
            </div><br>

            <!-- 按鈕點擊也會觸發 login -->
            <v-btn @click="callAuthFunc(userid, password, verifycode)" block class="mt-2 login-btn">
               <h3>登入</h3>
            </v-btn>
         </v-form>
      </v-sheet>
   </div>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { getVerifyCode, sendAuth } from './JS/authservice.js';

   export default {
      name: 'LetmeinPage',
      setup() { 
         const userid = ref('');
         const password = ref('');
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

         // 呼叫 sendAuth 傳送使用者登入資料
         function callAuthFunc() {
            sendAuth(userid.value, password.value, verifycode.value, verifyCodeArr.value.verifyCode_ans).then(() => {
               router.push('/index').then(() => {
                  window.location.reload();
               });
            })
         }

         return {
            userid,
            password,
            verifycode,
            verifyCodeArr,
            callAuthFunc,
            callVerifyCode,
         };
      },
   };

</script>

<style lang="css" scoped>
   @import "../assets/css/loginStyle.css";
</style>
