<template>
   <v-row class="survey-container">
      <v-col cols="12">
         <v-card style="width: 100%;">
            <v-list-item class="survey-title">
               <h3>減重5階段問卷</h3>
            </v-list-item>
            <v-card class="intro-container">
               <p class="intro-title">問卷填寫說明</p>
               <p class="intro-content">
                  系統將依照問卷填寫結果，為您安排到意圖前期、意圖期、準備期、行動期、維持期，5個階段群組。
               </p>
            </v-card>
         </v-card>

         <v-card class="question-container">
            <v-card class="question-inner">
                  <p class="question-title">1.&nbsp;&nbsp;問題一</p>
                  <div class="question-content">
                     <input class="form-check-input custom-checkbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1">
                     <label class="form-check-label" for="flexRadioDefault1">
                        選項1
                     </label>
                  </div>
                  <div class="form-check">
                     <input class="form-check-input custom-checkbox" type="checkbox">
                     <label class="form-check-label">
                        選項2
                     </label>
                  </div>
                  <div class="form-check">
                     <input class="form-check-input custom-checkbox" type="checkbox">
                     <label class="form-check-label">
                        選項3
                     </label>
                  </div>
                  <div class="form-check">
                     <input class="form-check-input custom-checkbox" type="checkbox">
                     <label class="form-check-label">
                        選項4
                     </label>
                  </div>
            </v-card>

            <v-card class="question-inner">
               <p class="question-title">2.&nbsp;&nbsp;問題二</p>
               <div class="question-content">
                  <input class="form-check-input custom-checkbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1">
                  <label class="form-check-label" for="flexRadioDefault1">
                     選項1
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項2
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項3
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項4
                  </label>
               </div>
            </v-card>

            <v-card class="question-inner">
               <p class="question-title">3.&nbsp;&nbsp;問題三</p>
               <div class="question-content">
                  <input class="form-check-input custom-checkbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1">
                  <label class="form-check-label" for="flexRadioDefault1">
                     選項1
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項2
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項3
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項4
                  </label>
               </div>
            </v-card>

            <v-card class="question-inner">
               <p class="question-title">4.&nbsp;&nbsp;問題四</p>
               <div class="question-content">
                  <input class="form-check-input custom-checkbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1">
                  <label class="form-check-label" for="flexRadioDefault1">
                     選項1
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項2
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項3
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項4
                  </label>
               </div>
            </v-card>

            <v-card class="question-inner">
               <p class="question-title">5.&nbsp;&nbsp;問題五</p>
               <div class="question-content">
                  <input class="form-check-input custom-checkbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1">
                  <label class="form-check-label" for="flexRadioDefault1">
                     選項1
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項2
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項3
                  </label>
               </div>
               <div class="form-check">
                  <input class="form-check-input custom-checkbox" type="checkbox">
                  <label class="form-check-label">
                     選項4
                  </label>
               </div>
            </v-card>

            <div class="button-container">
               <v-btn class="submitBtn">送出答案</v-btn>
               <v-btn class="cancelBtn">取消作答</v-btn>
            </div>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
   export default {
      name: 'surveyPage'
   }
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/survey.css";
</style>