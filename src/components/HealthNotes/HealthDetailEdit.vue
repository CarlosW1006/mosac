<template>
   <!-- 頁籤區塊 -->
   <div class="page-tab flex-container">
      <a href="#/healthNotes" class="tab-L">回到健康手札</a>
      <p class="tab-R">健康手札＞健康紀錄</p>
   </div>
   <v-container :class="{ 'container-no-right': !hasRightContent }" fluid>
      <div class="health-detail"> 
         <v-card>
            <v-list-item class="list-title">
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">健康手札</h3>
                  <p class="hd-title">{{ formattedDate }} 上傳紀錄</p>
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
                              v-model="healthInfo.walkingTimes" 
                              placeholder="輸入時間" 
                           />
                           <span class="unit">分鐘</span>
                        </div>
                     </div>

                     <div class="form-group" :class="isRedBg(2)">
                       <label class="form-label">每日飲食目標(符合 211 餐盤)：</label>
                       <div class="diet-options disabled-diet">
                          <input type="radio" id="dietNo" value="否" v-model="healthInfo.diet" disabled />
                          <label for="dietNo" class="disabled-text">否；</label>
                          <input type="radio" id="dietYes" value="是" v-model="healthInfo.diet" disabled />
                          <label for="dietYes" class="disabled-text">是</label>
                          <span class="checkbox-group" v-if="healthInfo.diet === '是'">
                             (
                             <input type="checkbox" ref="breakfast" :checked="healthInfo.selectedMeals.includes('早餐')" disabled />
                             <label class="disabled-text">早餐</label>
                             <input type="checkbox" ref="lunch" :checked="healthInfo.selectedMeals.includes('午餐')" disabled />
                             <label class="disabled-text">午餐</label>
                             <input type="checkbox" ref="dinner" :checked="healthInfo.selectedMeals.includes('晚餐')" disabled />
                             <label class="disabled-text">晚餐</label>
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
         <v-btn class="save-hr-btn" @click="saveHealthInfo">儲存編輯紀錄</v-btn>
      </div>
   </v-container>
   <!-- 等待執行結果動畫 -->
   <isLoading :active="loading" color="#76caad"/>
</template>


<script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { addHealthRecord, getAllHealthRecordsByDate } from '../../api/healthNote';

  export default {
    name: 'healthDetailEditPage',
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
         const recordId = route.query.recordId;

         if (!dateString || !recordId) {
            console.error('未提供必要參數');
            return;
         }

         loading.value = true;
         try {
            // 獲取特定記錄的數據
            const records = await getAllHealthRecordsByDate(dateString);
            const recordData = records.find(record => record.id === recordId);

            if (recordData) {
               // 設置資料但不包含複選框更新邏輯
               healthInfo.value = {
               steps: recordData.dailySteps,
               walkingTimes: recordData.dailyJoggingTime,
               diet: recordData.dailyDietGoal.startsWith('是') ? '是' : '否',
               selectedMeals: recordData.dailyDietGoal.startsWith('是') 
                  ? recordData.dailyDietGoal.match(/早餐|午餐|晚餐/g) || []
                  : [],
               weight: recordData.weeklyWeight,
               hba1c: recordData.HbA1c
               };
            }
         } catch (error) {
            console.error('載入健康紀錄失敗:', error);
         } finally {
            loading.value = false;
         }
         });

      const saveHealthInfo = async () => {
         if (!validateForm()) return;

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

            // 儲存記錄
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

      // 新增表單驗證方法
      const validateForm = () => {
         // 步數驗證
         if (!healthInfo.value.steps) {
            alert('請輸入每日步數');
            return false;
         }

         // 慢跑時間驗證
         if (healthInfo.value.walkingTimes.every(time => time === 0)) {
            alert('請輸入慢跑時間');
            return false;
         }

         // 飲食目標驗證
         if (healthInfo.value.diet === '是' && healthInfo.value.selectedMeals.length === 0) {
            alert('請選擇至少一餐');
            return false;
         }

         // 體重驗證（每週六才需要）
         if (isSaturday.value && !healthInfo.value.weight) {
            alert('請輸入每週體重');
            return false;
         }

         // HbA1C驗證（特定日期才需要）
         if (needHbA1c.value && !healthInfo.value.hba1c) {
            alert('請輸入HbA1C數值');
            return false;
         }

         return true;
      };

      //表單背景(灰白)
      const isRedBg = (index) => {
         return{
            'form-group':true,
            'red-bg': index % 2 === 0
         };
      };

      return {
        healthInfo,
        formattedDate,
        loading,
        saveHealthInfo,
        isRedBg,
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

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthknow.css";
</style>