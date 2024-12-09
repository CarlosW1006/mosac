<template>
   <!-- 頁籤區塊 -->
   <div class="page-tab flex-container">
      <a href="#/healthNotes" class="tab-L">回到健康手札</a>
      <p class="tab-R">健康手札＞健康紀錄</p>
   </div>
   <v-container fluid>
      <div class="health-detail"> 
         <v-card>
            <v-list-item class="list-title">
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">健康手札</h3>
                  <p class="hd-title">{{ formattedDate }} 健康紀錄</p>
               </div>
            </v-list-item>
            
            <!-- 外層的響應式排列 -->
            <v-row style="padding: 2em;">
               <!-- 左側主要表單區塊 -->
               <v-col cols="12" :md="hasRightContent ? 7 : 12">
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
                        <div class="input-unit-wrapper">
                        <input
                           type="number"
                           id="walkingTime"
                           v-model="healthInfo.walkingTime"
                           placeholder="輸入時間"
                        />
                        <span class="unit">分鐘</span>
                        </div>
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
               <v-col v-if="hasRightContent" cols="12" md="5" lg="5">
                  <v-row>
                  <!-- 每週體重紀錄區塊 - 只在週六顯示 -->
                  <v-col cols="12" v-if="isSaturday">
                     <h2 class="form-title">每週體重紀錄</h2>
                     <div class="form-container form-group" :class="isRedBg(4)">
                        <label class="form-label" for="weight">每週體重：</label>
                        <div class="input-unit-wrapper">
                           <input type="number" id="weight" v-model="healthInfo.weight" placeholder="輸入體重" />
                           <span class="unit">公斤</span>
                        </div>
                     </div> 
                  </v-col>

                  <!-- 每3個月HbA1C紀錄區塊 - 只在特定日期顯示 -->
                  <v-col cols="12" v-if="needHbA1c">
                     <h2 class="form-title">每3個月HbA1C紀錄</h2>
                     <div class="form-container form-group" :class="isRedBg(6)">
                        <label class="form-label" for="hba1c">HbA1C：</label>
                        <div class="input-unit-wrapper">
                           <input type="text" id="hba1c" v-model="healthInfo.hba1c" placeholder="輸入HbA1C數值" />
                           <span class="unit"></span>
                        </div>
                     </div>
                  </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-card>
         <v-btn class="save-hr-btn" @click="saveHealthInfo">儲存健康紀錄</v-btn>
      </div>
   </v-container>
   <!-- 等待執行結果動畫 -->
   <isLoading :active="loading" color="#76caad"/>
</template>


<script>
   import { ref, computed, onMounted, nextTick } from 'vue';
   import { useRoute } from 'vue-router';
   import { addHealthRecord, getHealthRecordByDate } from '../../api/healthNote';

   export default {
      name: 'healthDetailFormPage',
      setup() {
         const healthInfo = ref({
            steps: '',
            walkingTimes: '',
            diet: '',
            selectedMeals: [],
            weight: '',
            hba1c: ''
         });

         const breakfast = ref(null);
         const lunch = ref(null);
         const dinner = ref(null);
         const route = useRoute();
         const loading = ref(false);

         const formattedDate = computed(() => {
            // 從路由參數中獲取日期
            const dateString = route.query.date;
            if (dateString) {
               const date = new Date(dateString);
               // 格式化日期為本地化日期字串
               return date.toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
               });
            }
            return ''; // 如果沒有日期，返回空字串
         });

         // onMounted 部分的更新
         onMounted(async () => {
            const dateString = route.query.date;
            if (!dateString) {
               console.error('未提供日期參數');
               return;
            }

            // 每次掛載時都重置表單
            healthInfo.value = {
               steps: '',
               walkingTime: '',
               diet: '',
               selectedMeals: [],
               weight: '',
               hba1c: ''
            };

            loading.value = true;
            try {
               // 只抓取當天最新的資料來設定飲食目標的預設值
               const recordData = await getHealthRecordByDate(dateString);
               if (recordData?.dailyDietGoal) {
                  // 只設定飲食相關的值
                  healthInfo.value.diet = recordData.dailyDietGoal.startsWith('是') ? '是' : '否';
                  if (recordData.dailyDietGoal.startsWith('是')) {
                     healthInfo.value.selectedMeals = recordData.dailyDietGoal.match(/早餐|午餐|晚餐/g) || [];
                     
                     // 設置複選框狀態
                     await nextTick();
                     if (healthInfo.value.diet === '是') {
                        if (breakfast.value) breakfast.value.checked = healthInfo.value.selectedMeals.includes('早餐');
                        if (lunch.value) lunch.value.checked = healthInfo.value.selectedMeals.includes('午餐');
                        if (dinner.value) dinner.value.checked = healthInfo.value.selectedMeals.includes('晚餐');
                     }
                  }
               }
            } catch (error) {
               console.error('載入健康紀錄失敗:', error);
            } finally {
               loading.value = false;
            }
         });

         const saveHealthInfo = async () => {
            // 檢查如果選擇"是"但沒有選擇任何餐點時跳出警示
            if (healthInfo.value.diet === '是' && healthInfo.value.selectedMeals.length === 0) {
               alert('請至少選擇一餐');
               return;
            }

            loading.value = true;
            try {
               const selectedDate = route.query.date;
               const currentTime = new Date();
               
               // 合併選擇的日期和當前時間
               const targetDate = new Date(selectedDate);
               targetDate.setHours(currentTime.getHours(), 
                                 currentTime.getMinutes(), 
                                 currentTime.getSeconds(), 
                                 currentTime.getMilliseconds());

               // 儲存記錄 - 直接傳遞所有值,讓後端處理 null 值
               const savedRecord = await addHealthRecord({
                  ...healthInfo.value,
                  date: targetDate.toISOString()
               });

               // 確保有完整的記錄數據
               if (savedRecord) {
                  // 明確設置要保存的數據結構
                  const recordToCache = {
                  ...savedRecord,
                  createAt: targetDate.toISOString()
                  };
                  sessionStorage.setItem('temp-health-record', JSON.stringify(recordToCache));
               }

               // 跳轉到檢視頁面
               window.location.href = `#/healthDetailView?date=${selectedDate}`;
            } catch (error) {
               console.error('儲存健康紀錄失敗:', error);
            } finally {
               loading.value = false;
            }
         };

         const hasRightContent = computed(() => {
            return isSaturday.value || needHbA1c.value;
         });

         const isSaturday = computed(() => {
            const selectedDate = new Date(route.query.date);
            return selectedDate.getDay() === 6;  // 0 是星期日，6 是星期六
         });

         const needHbA1c = computed(() => {
            const selectedDate = new Date(route.query.date);
            const month = selectedDate.getMonth() + 1;
            const date = selectedDate.getDate();
            
            // 直接比較月和日
            return (month === 3 && date === 31) ||
                  (month === 6 && date === 30) ||
                  (month === 9 && date === 30) ||
                  (month === 12 && date === 31) ||
                  (month === 12 && date === 4); // 添加 12/4 的判斷
         });

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
         healthInfo,
         formattedDate,
         loading,
         saveHealthInfo,
         isRedBg,
         updateMeals,
         breakfast,
         lunch,
         dinner,
         hasRightContent,
         isSaturday,
         needHbA1c,
         };
      }
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/healthNoteDetail.css"></style>