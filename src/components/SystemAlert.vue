<template>
   <div v-if="dataReady && showAlert" class="overlay">
      <v-card class="system-alert">
         <v-card-title class="alert-title">
            <span class="alert-title-font">通知訊息</span>
            <v-btn icon @click="closeAlert" class="close-btn">
               <v-icon>mdi-close</v-icon>
            </v-btn>
         </v-card-title>
         <v-card-text class="flex-container">
            <p>目前尚有<span class="day-count">{{ uncompleteNumber }}</span>天健康紀錄還未完成，請盡快填寫謝謝。</p>
         </v-card-text>
      </v-card>
   </div>
</template>

<script>
   import { ref } from 'vue';
   import { changeDate, askHealthNoteRecord } from '../api/healthNote.js';

   export default {
      setup() {
         let showAlert = ref(true);
         let dataReady = ref(false);
         const uncompleteNumber = ref('');

         function closeAlert() {
            showAlert.value = false;
         }

         // 計算未完成天數
         askHealthNoteRecord(changeDate(new Date()-(2*24*60*60*1000)), changeDate(new Date()))
         .then((result) => {
            uncompleteNumber.value = result.uncompleteNumber;
            if (result.uncompleteNumber === 0) {
               showAlert.value = false;
            }
            dataReady.value = true; // 先跑完數據再顯示通知
         });

         return {
            showAlert,
            dataReady,
            uncompleteNumber,
            closeAlert,
         };
      },
   };
</script>

<style scoped>
   .overlay {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
      display: flex;
      position: fixed;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
   }

   .system-alert {
      width: 600px;
      height: 300PX;
      max-width: 90%;
      border-radius: 10px;
      z-index: 9999;
      background-color: #fffbf7;
      border: 8px solid #6cb39a;
   }

   .alert-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      color: #FFFFFF;
      background-color: #6cb39a;
   }

   .flex-container {
      display: flex;
      color: #6cb39a;
      align-items: center;
      justify-content: center;
   }

   .close-btn {
      color: #6cb39a;
      margin-bottom: 5px;
      margin-right: -10px;
   }

   .alert-title-font {
      margin-bottom: 5px;
   }

   p {
      font-size: 30px;
      font-weight: 600;
      margin-top: 65px;
      padding: 0 20px 0;
      text-align:justify;
   }

   .day-count {
      color: red;
   }

   @media screen and (max-width: 600px) {
      p {
         font-size: 25px;
         font-weight: 600;
         margin-top: 60px;
         padding: 0 20px 0;
      }
   }
</style>
