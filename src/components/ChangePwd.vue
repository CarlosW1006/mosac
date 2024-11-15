<template>
   <div class="center-container">
      <v-sheet class="mx-auto"> 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame" @keyup.enter="changeConfirm">
            <h2 class="frame-title">修改密碼</h2>

            <v-text-field v-model="originPassword" label="請輸入舊的密碼" solo
            :type="showOldPassword ? 'text' : 'password'" autocomplete :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleOldPasswordVisibility">
               <template v-slot:prepend>
                  <v-icon>mdi-lock</v-icon>
               </template>
            </v-text-field>

            <v-text-field v-model="newPassword" label="請輸入新的密碼" solo
            :type="showNewPassword ? 'text' : 'password'" autocomplete :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleNewPasswordVisibility">
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
   import { askVerify, changePassword } from '@/api/auth';

   export default {
      name: 'changepwdPage',
      setup() { 
         let isLoading = ref(false);
         const originPassword = ref('');
         const newPassword = ref('');
         const verifyAnswer = ref('');
         const verifyCodeArr = ref('');

         const router = useRouter();
         const showOldPassword = ref(false);
         const showNewPassword = ref(false);

         // 取得驗證碼資料
         askVerify(verifyCodeArr);

         // 手動取得驗證碼資料
         function callVerify() {
            askVerify(verifyCodeArr);
            console.log('call success!!');
         }

         // 調整密碼顯示方式
         function toggleOldPasswordVisibility() {
            showOldPassword.value = !showOldPassword.value;
         }
         function toggleNewPasswordVisibility() {
            showNewPassword.value = !showNewPassword.value;
         }

         function changeConfirm() { 
            if(originPassword.value == "" || newPassword.value == "") {
               alert('密碼輸入不可為空');
            }
            else {
               isLoading.value = true;
               changePassword(originPassword.value, newPassword.value, verifyCodeArr.value.verify_id, verifyAnswer.value)
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
            originPassword,
            newPassword,
            verifyAnswer,
            verifyCodeArr,

            callVerify,
            changeConfirm,
            showOldPassword,
            showNewPassword,
            toggleOldPasswordVisibility,
            toggleNewPasswordVisibility,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/loginStyle.css";
</style>
