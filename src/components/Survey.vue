<template>
   <v-row class="survey-container">
      <v-col cols="12">
         <v-card style="width: 100%;">
            <v-list-item class="survey-title">
               <h3>健康減重計畫階段問卷</h3>
            </v-list-item>
            <v-card class="intro-container">
               <p class="intro-content">
                  『健康減重』指的是實踐健康均衡飲食及從事規律的身體運動(如:快走、游泳、慢跑、騎走踏車、爬樓梯、各種球類活動…等)
                  以達到體重的控制，請問您目前是否進行健康減重?
               </p>

               <div class="form-check-container">
                  <input class="form-check-input" type="checkbox" value="1"
                  v-model="surveyResult" @change="toggleCheckbox('1')">
                  <label class="form-check-label">
                     沒有，且在未來6個月內沒計畫開始減重
                  </label>
               </div>
               <div class="form-check-container">
                  <input class="form-check-input" type="checkbox" value="2" 
                  v-model="surveyResult" @change="toggleCheckbox('2')">
                  <label class="form-check-label">
                     沒有，但計畫在未來6個月內開始減重
                  </label>
               </div>
               <div class="form-check-container">
                  <input class="form-check-input" type="checkbox" value="3" 
                  v-model="surveyResult" @change="toggleCheckbox('3')">
                  <label class="form-check-label">
                     目前有在控制飲食及運動但沒有規律，計畫未來一個月內開始運動
                  </label>
               </div>
               <div class="form-check-container">
                  <input class="form-check-input" type="checkbox" value="4" 
                  v-model="surveyResult" @change="toggleCheckbox('4')">
                  <label class="form-check-label">
                     有，減重中但未滿6個月
                  </label>
               </div>
               <div class="form-check-container">
                  <input class="form-check-input" type="checkbox" value="5" 
                  v-model="surveyResult" @change="toggleCheckbox('5')">
                  <label class="form-check-label">
                     有，而且已執行減重超過6過月
                  </label>
               </div>

               <div class="button-container">
                  <v-btn class="submitBtn" @click="sendSurveyOutcome()">送出答案</v-btn>
               </div>
            </v-card>
         </v-card>

      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { postSurveyOutcome } from '@/api/survey';

   export default {
      name: 'surveyPage',
      setup() {
         let isLoading = ref(false);
         let surveyResult = ref([]);
         const router = useRouter();

         function toggleCheckbox(value) {
            const numericValue = Number(value);
            if (surveyResult.value.includes(numericValue)) {
               surveyResult.value[0] = value;
               console.log(surveyResult.value[0]);
            } else {
               surveyResult.value = [];
               surveyResult.value.push(value);
            }
         }

         function sendSurveyOutcome() {
            if (surveyResult.value.length === 0) {
               alert("請選擇一個選項後再送出");
               return;
            }

            isLoading.value = true;

            postSurveyOutcome(parseInt(surveyResult.value[0])).then(() => {
               sessionStorage.setItem('hasPendingSurvey', 'true');
               alert("本月問卷填寫完成");
               isLoading.value = false;
               router.push('/index').then(() => {
                  window.location.reload();
               });
            });
         }

         return {
            isLoading,
            surveyResult,
            toggleCheckbox,
            sendSurveyOutcome,
         };
      },
   };

</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/survey.css";
</style>