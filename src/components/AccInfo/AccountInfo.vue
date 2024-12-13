<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞帳號資料</p>
   </div>

   <v-row style="margin: 1% 1% 20px;">
      <v-col>
         <v-row>
            <!-- 帳號資料檢視 -->
            <v-col cols="12" sm="12" md="6" lg="6">
               <v-card>
                  <v-list-item class="list-title">
                     <h3 class="page-title">帳號資料檢視</h3>
                  </v-list-item>

                  <template v-for="(item, index) in accInfoItems" :key="index">
                     <v-list-item class="list-item" v-if="item.show">
                        <div class="flex-container">
                           <h4 class="list-name">{{ item.label }}</h4>
                           <p class="list-info50">{{ item.value }}</p>
                        </div>
                     </v-list-item>
                  </template>
                  
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號暱稱：</h4>
                        <input type="string" id="steps" class="item-input" v-model="accname" :placeholder="accInfoArr.nickName || '請輸入暱稱'" />
                     </div>
                  </v-list-item>
               </v-card>

               <v-btn class="exchange-btn" @click="handleSave(accname)" :ripple="false">儲存個人資料</v-btn>
            </v-col>

            <!-- 減重階段/目標 -->
            <v-col cols="12" sm="12" md="6" lg="6" v-if="accType == 0">
               <v-card>
                  <v-list-item class="list-title">
                     <h3 class="page-title">減重階段/目標</h3>
                  </v-list-item>

                  <template v-for="(item, index) in accTargetInfoItems" :key="index">
                     <v-list-item class="list-item" v-if="item.show">
                        <div class="flex-container">
                           <h4 class="list-name">{{ item.label }}</h4>
                           <p class="list-info50">{{ item.value }}</p>
                        </div>
                     </v-list-item>
                  </template>
               </v-card>
            </v-col>
         </v-row>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref, computed } from 'vue';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { changeAccInfo } from '../../api/accInfo.js';
   import userImage from '../../assets/images/user.png';
   import { askAccInfo, askTargetInfo } from '../../api/accInfo.js';

   export default {
      name: 'accInfoPage',
      
      setup() {
         let isLoading = ref(false);
         let accType = sessionStorage.getItem('accType');
         let accInfoArr = ref('');
         let accTargetInfoArr = ref('');

         const { winwidth } = useWindowWidth();
         const accname = ref('');

         askAccInfo().then((result) => { 
            accInfoArr.value = result;
         });

         askTargetInfo().then((result) => {
            accTargetInfoArr.value = result;
         })

         async function handleSave(accname) { 
            isLoading.value = true;
            try {
               await changeAccInfo(accname);
            } finally {
               isLoading.value = false;
               
               setTimeout(() => {
                  window.location.reload();
               }, 1000);
            }
         }

         // 陣列化使用者資料、目標
         const accInfoItems = computed(() => [
            {
               label: '帳號名稱：',
               value: accInfoArr.value.credential || '',
               show: true,
            },
            {
               label: '帳號類別：',
               value: accInfoArr.value.userType || '',
               show: true,
            },
            {
               label: '帳號姓名：',
               value: accInfoArr.value.name || '',
               show: true,
            }
         ]);

         const accTargetInfoItems = computed(() => [
            {
               label: '目前階段：',
               value: accTargetInfoArr.value.currentPhase || '',
               show: true,
            },
            {
               label: '目標體重：',
               value: accTargetInfoArr.value.currentWeight ? accTargetInfoArr.value.currentWeight + ' 公斤' : '',
               show: true,
            },
            {
               label: '每日步數：',
               value: accTargetInfoArr.value.currentSteps ? accTargetInfoArr.value.currentSteps + '步' : '',
               show: true,
            },
            {
               label: '慢跑時間：',
               value: accTargetInfoArr.value.currentJogTime ? accTargetInfoArr.value.currentJogTime + '分鐘' : '',
               show: true,
            }
         ]);
         
         return {
            winwidth,
            isLoading,
            accType,
            userImage,
            accname,
            accInfoArr,
            accInfoItems,
            accTargetInfoArr,
            accTargetInfoItems,

            handleSave,
         }
      }
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/accountInfo.css"></style>