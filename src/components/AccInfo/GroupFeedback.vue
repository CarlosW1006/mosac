<template>
   <div class="page-tab flex-container">
      <a href="#/grouprank" class="tab-L">回到群組排名</a> <p class="tab-R">群組排名＞心得回饋</p>
   </div>

   <v-row style="margin: 1% 1% 20px;">
      <v-col>
         <v-row>
            <!-- 帳號資料檢視 -->
            <v-col cols="12" sm="12" md="6" lg="6">
               <v-card>
                  <v-list-item class="list-title">
                     <div class="flex-container" style="justify-content: space-between;">
                        <h3 class="page-title">心得回饋</h3>
                     </div>
                  </v-list-item>
                     
                  <template v-for="(item, index) in infoItems" :key="index">
                     <v-list-item class="list-item">
                        <div class="flex-container">
                           <h4 class="list-name">{{ item.label }}</h4>
                           <p class="list-info50">{{ item.value }}</p>
                        </div>
                     </v-list-item>
                  </template>
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">心得回饋：</h4>
                        <p class="list-info50"></p>
                     </div>
                     <v-card class="feedback-container">
                        <p class="feedback-font">{{ feedBackData.feedback }}</p>
                     </v-card>
                  </v-list-item>
               </v-card>
            </v-col>
         </v-row>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref, computed, onMounted } from 'vue';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { getFeedback } from '../../api/groupRank.js';

   export default {
      name: 'groupFeedbackPage',
      
      setup() {
         let isLoading = ref(true);
         let feedBackData = ref('');
         const { winwidth } = useWindowWidth();
         const hashUrl = ref(window.location.hash);
         const queryString = hashUrl.value.split('?')[1];
         const params = new URLSearchParams(queryString);
         const phaseRecordId = params.get('phaseRecordId');
         const month = params.get('month');

         // 當頁面載入後檢查當前的 hash 值
         onMounted(() => {
            hashUrl.value = window.location.hash;
         });

         // 監聽 hash 值的變化
         window.addEventListener('hashchange', () => {
            hashUrl.value = window.location.hash;
         });

         Promise.all([
            getFeedback(phaseRecordId, month).then((result) => { 
               feedBackData.value = result;
            }),
         ]).finally(() => {
            isLoading.value = false; // 所有資料加載完成後設為 false
         });

         // 陣列化心得回饋資訊
         const infoItems = computed(() => [
            {
               label: '帳號暱稱：',
               value: feedBackData.value.user.nickname == null ? feedBackData.value.blockname : 
               feedBackData.value.user.nickname,
            },
            {
               label: '減重進度：',
               value:  feedBackData.value.completionRate,
            },
            {
               label: '階段群組：',
               value: feedBackData.value.phaseMonth + feedBackData.value.phase,
            },
         ]);
         
         return { 
            winwidth,
            isLoading,
            infoItems,
            feedBackData,
         }
      }
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/accountInfo.css"></style>