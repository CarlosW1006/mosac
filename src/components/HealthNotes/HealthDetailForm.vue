<template>
   <!-- 頁籤區塊 -->
   <div class="page-tab flex-container">
      <a href="#/healthNotes" class="tab-L">回到健康紀錄</a>
      <p class="tab-R">健康手札＞健康紀錄</p>
   </div>
   <v-container fluid>
      <div class="health-detail"> 
         <v-card>
         <v-list-item class="list-title" style="margin-bottom: 1em;">
            <div class="flex-container" style="justify-content: space-between;">
               <h3 class="page-title">健康手札</h3>
               <p class="hd-title">{{ formattedDate }} 健康紀錄</p>
            </div>
         </v-list-item>
         
         <!-- 外層的響應式排列 -->
         <v-row style="padding: 1em 1em 2em 1em;">
            <!-- 左側主要表單區塊 -->
            <v-col cols="12" md="7">
               <h2 class="form-title">每日健康紀錄</h2>
               <form @submit.prevent="saveHealthInfo" class="form-container">
               <!-- 每日記錄區塊 -->
               <div>
                  <div class="form-group" :class="isRedBg(0)">
                     <label class="form-label" for="steps">每日步數：</label>
                     <div class="input-unit-wrapper">
                     <input type="number" id="steps" v-model="healthInfo.steps" placeholder="輸入步數" />
                     <span class="unit">步</span>
                     </div>
                  </div>

                  <div class="form-group" :class="isRedBg(1)">
                     <label class="form-label" for="walkingTime">每日慢跑時間：</label>
                     <div v-for="(time, index) in healthInfo.walkingTimes" :key="index" class="input-unit-wrapper">
                     <input type="number" v-model="healthInfo.walkingTimes[index]" placeholder="輸入時間" />
                     <span class="unit">分鐘</span>
                     <button v-if="index > 0" @click.prevent="removeWalkingTime(index)" class="btn-round">X</button>
                     </div>
                     <button @click.prevent="addWalkingTime" class="add-btn">+</button>
                  </div>

                  <div class="form-group" :class="isRedBg(2)">
                     <label class="form-label">每日飲食目標(符合 211 餐盤)：</label>
                     <div class="diet-options">
                     <input type="radio" id="dietNo" value="否" v-model="healthInfo.diet" />
                     <label for="dietNo">否；</label>
                     <input type="radio" id="dietYes" value="是" v-model="healthInfo.diet" />
                     <label for="dietYes">是</label>
                     <span class="checkbox-group" v-if="healthInfo.diet === '是'">
                        (
                        <input type="checkbox" ref="breakfast" @change="updateMeals" />
                        <label>早餐</label>
                        <input type="checkbox" ref="lunch" @change="updateMeals" />
                        <label>午餐</label>
                        <input type="checkbox" ref="dinner" @change="updateMeals" />
                        <label>晚餐</label>
                        )
                     </span>
                     </div>
                  </div>
               </div>
               </form>
            </v-col>

            <!-- 右側區塊容器 -->
            <v-col cols="12" md="5">
               <v-row>
               <!-- 每周體重紀錄區塊 -->
               <v-col cols="12">
                  <h2 class="form-title">每周體重紀錄</h2>
                  <div class="form-container form-group" :class="isRedBg(4)">
                     <label class="form-label" for="weight">每周體重：</label>
                     <div class="input-unit-wrapper">
                     <input type="number" id="weight" v-model="healthInfo.weight" placeholder="輸入體重" />
                     <span class="unit">公斤</span>
                     </div>
                  </div> 
               </v-col>

               <!-- 每3個月HbA1C紀錄區塊 -->
               <v-col cols="12">
                  <h2 class="form-title">每3個月HbA1C紀錄</h2>
                  <div class="form-container form-group" :class="isRedBg(6)">
                     <label class="form-label" for="hba1c">HbA1C：</label>
                     <div class="input-unit-wrapper">
                     <input type="text" id="hba1c" v-model="healthInfo.hba1c" placeholder="輸入HbA1C數值" />
                     <span class="unit">?</span>
                     </div>
                  </div>
               </v-col>
               </v-row>
            </v-col>
         </v-row>
         </v-card>
         <v-btn class="save-button" @click="saveHealthInfo">儲存</v-btn>
      </div>
   </v-container>
</template>


<script>
  import { useWindowWidth } from '../JS/winwidth.js';
  import { ref,computed } from 'vue';
  import { useRouter } from 'vue-router';
  import localStorageService from './localStorageService.js';
  
  export default {
    name: 'healthDetailFormPage',
    setup() {
      const { winwidth } = useWindowWidth();
      const healthInfo = ref( {
        steps: '',
        walkingTimes: [0],
        diet: '',
        selectedMeals: [],
        weight: '',
        hba1c: ''
      });

         const breakfast = ref(null);
         const lunch = ref(null);
         const dinner = ref(null);
         const router = useRouter(); 

         const formattedDate = computed(() => {
         const urlParams = new URLSearchParams(window.location.search);
         const date = urlParams.get('date');
         return new Date(date).toLocaleDateString();
         });

         const saveHealthInfo = () => {
         if (healthInfo.value.diet === '是' && healthInfo.value.selectedMeals.length === 0){
            alert('必須選擇至少一餐');
            return; // 取消保存
         }
         // 使用 localStorage 服務來保存健康資料
         localStorageService.setItem('healthInfo', healthInfo.value);
         // 使用 this.$router 進行路由跳轉
         router.push('/healthDetailView');
         };
         
         const addWalkingTime = () => {
         healthInfo.value.walkingTimes.push(0);
         };

         const removeWalkingTime = (index) => {
         healthInfo.value.walkingTimes.splice(index, 1);
         };

         //表單背景(灰白)
         const isRedBg = (index) => {
         return{
            'form-group':true,
            'red-bg': index % 2 === 0
         };
         };

         const updateMeals = () => {
         healthInfo.value.selectedMeals = [];
         if (breakfast.value.checked) healthInfo.value.selectedMeals.push('早餐');       
         if (lunch.value.checked) healthInfo.value.selectedMeals.push('午餐');       
         if (dinner.value.checked) healthInfo.value.selectedMeals.push('晚餐');      
         };

      return {
        winwidth,
        healthInfo,
        formattedDate,
        saveHealthInfo,
        addWalkingTime,
        removeWalkingTime,
        isRedBg,
        updateMeals,
        breakfast,
        lunch,
        dinner
      };
    }
  };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthknow.css";
</style>
