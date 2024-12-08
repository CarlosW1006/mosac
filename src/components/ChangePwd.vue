<template>
   <div class="center-container">
      <v-sheet class="mx-auto"> 
         <p class="sys-title">自我健康管理雲端平台</p>
         <form class="login-frame" @keyup.enter="changeConfirm(password, password2, verifyAnswer)">
            <h2 class="frame-title">修改密碼</h2>

            <v-text-field v-model="password" label="請輸入舊的密碼" solo :type="showPassword ? 'text' : 'password'" 
            autocomplete :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleNewPasswordVisibility">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <v-text-field v-model="password2" label="請輸入新的密碼" solo :type="showPassword2 ? 'text' : 'password'" 
            autocomplete :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleNewPassword2Visibility">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <div class="flex-container-login">
               <label class="verify-frame"><p>{{ verifyCodeArr.verify_num1 }}+{{ verifyCodeArr.verify_num2 }}=?</p></label>
               <v-text-field v-model="verifyAnswer" label="請輸入驗證碼"></v-text-field>
            </div>

            <div class="flex-container-login">
               <button class="text-body-2 font-weight-regular change-vcode" @click="callVerify()">重新產生驗證碼</button>
            </div><br>

            <v-btn @click="changeConfirm" block class="mt-2 login-btn"><h3>確認</h3></v-btn>
         </form>
      </v-sheet>
   </div>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { usePasswordToggle } from './JS/authservice';
   import { askVerify, changePassword } from '@/api/auth';
   // import { generateSHA256Hash } from './JS/encryption.js';

   export default {
      name: 'changepwdPage',
      setup() { 
         const router = useRouter();
         let isLoading = ref(false);
         const password = ref('');
         const password2 = ref('');
         const verifyAnswer = ref('');
         const verifyCodeArr = ref('');
         const { isPasswordVisible: showPassword, togglePasswordVisibility: toggleNewPasswordVisibility } = usePasswordToggle();
         const { isPasswordVisible: showPassword2, togglePasswordVisibility: toggleNewPassword2Visibility } = usePasswordToggle();
         
         // 取得驗證碼資料
         askVerify(verifyCodeArr);

         // 手動取得驗證碼資料
         function callVerify() {
            verifyAnswer.value = '';
            askVerify(verifyCodeArr);
         }

         function changeConfirm() { 
            if(password.value == "" || password2.value == "") {
               alert('密碼輸入不可為空');
            }
            else {
               isLoading.value = true;
               changePassword(password.value, password2.value, verifyCodeArr.value.verify_id, verifyAnswer.value)
               .then(() => {
                  isLoading.value = false;
                  router.push('/index').then(() => {
                     window.location.reload();
                  });
               })
               .catch((error) => {
                  isLoading.value = false;
                  if (error.response && error.response.data && error.response.data.message) {
                     alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
                  } else {
                     alert('資料處理發生異常，請聯絡系統管理員' + error);
                  }
               });
            }
         }
         
         return { 
            isLoading,
            password,
            password2,
            verifyAnswer,
            verifyCodeArr,
            showPassword,
            showPassword2,

            callVerify,
            changeConfirm,
            toggleNewPasswordVisibility,
            toggleNewPassword2Visibility
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/loginStyle.css";
</style>
