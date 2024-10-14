<template>
   <div class="center-container">
      <v-sheet class="mx-auto" > 
         <p class="sys-title">自我健康管理雲端平台</p>
         <v-form fast-fail class="login-frame">
            <h2 class="frame-title">登入</h2> 
            
            <!-- 用 @keydown.enter 監聽 Enter 鍵 -->
            <v-text-field 
              v-model="userid" 
              label="請輸入您的帳號" 
              @keydown.enter="login(userid, password, verifycode)"
            ></v-text-field>
            
            <v-text-field 
              v-model="password" 
              label="請輸入您的密碼" 
              @keydown.enter="login(userid, password, verifycode)"
            ></v-text-field>

            <div class="flex-container">
               <label class="verify-str">2+4=?</label> &nbsp;&nbsp;
               <v-text-field 
                 v-model="verifycode" 
                 label="請輸入驗證碼" 
                 @keydown.enter="login(userid, password, verifycode)"
               ></v-text-field>
            </div>

            <div class="flex-container">
               <a href="#/changePwd" class="text-body-2 font-weight-regular">忘記密碼?</a>
               <button class="text-body-2 font-weight-regular">重新產生驗證碼</button>
            </div><br>

            <!-- 按鈕點擊也會觸發 login -->
            <v-btn @click="login(userid, password, verifycode)" block class="mt-2 login-btn">
              <h3>登入</h3>
            </v-btn>
         </v-form>
      </v-sheet>
   </div>
</template>

<script>
   import { ref, computed } from 'vue';
   import { useRouter } from 'vue-router';
   import { useWindowWidth } from './winwidth.js';

   export default {
      name: 'LetmeinPage',
      setup() { 
         const userid = ref('');
         const password = ref('');
         const verifycode = ref('');
         const router = useRouter();
         const { windowWidth } = useWindowWidth();

         // 使用 computed 動態計算 sheetWidth
         const sheetWidth = computed(() => {
            return windowWidth.value > 900 ? '400px' : '300px';
         });

         function login(userid, password, verifycode) {
            if(userid == '123' && password == '123' && verifycode == '6') {
               console.log('login success');
               sessionStorage.setItem('session', userid);
               router.push('/index').then(() => {
                  window.location.reload();
               });
            } else if(userid == '' || password == '' || verifycode == '') {
               alert('帳號、密碼或驗證碼不可為空');
            } else { 
               alert('帳號、密碼或驗證碼輸入錯誤');
            }
         }
         
         return {
            userid,
            password,
            verifycode,
            sheetWidth,
            windowWidth,
            login,
         };
      },
   };

</script>

<style lang="css" scoped>
   @import "../assets/css/loginStyle.css";
</style>
