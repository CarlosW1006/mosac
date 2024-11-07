<template>
  <!-- 頁籤區塊 -->
  <div class="page-tab flex-container">
     <a href="#/healthNotes" class="tab-L">回到健康紀錄</a>
     <p class="tab-R">健康手札 ＞ 健康紀錄</p>
  </div>

  <!-- 主要內容區塊 -->
  <v-row style="margin: 1% 1% 10px;">
     <v-col cols="12" sm="12" md="7" lg="7">
        <v-card>
           <v-list-item class="list-title">
            <div class="flex-container" style="justify-content: space-between;">
            <h3 class="page-title">健康手札</h3>
            <p class="hd-title">{{ formattedDate }} 健康紀錄</p>
          </div>
           </v-list-item>

           <!-- 每日步數 -->
           <v-list-item class="list-item">
              <div class="flex-container">
                 <h4 class="list-name">每日步數：</h4>
                 <p class="list-info50">{{ healthInfo.steps }} 步</p>
              </div>
           </v-list-item>

           <!-- 每日慢跑時間 -->
           <v-list-item class="list-item">
              <div class="flex-container">
                 <h4 class="list-name">每日慢跑時間：</h4>
                 <p class="list-info50">{{ totalWalkingTime }} 分鐘</p>
              </div>
           </v-list-item>

           <!-- 每日飲食目標 -->
           <v-list-item class="list-item">
              <div class="flex-container">
                 <h4 class="list-name">每日飲食目標：</h4>
                 <p class="list-info50">
                    <span v-if="healthInfo.selectedMeals && healthInfo.selectedMeals.length > 0">
                       {{ healthInfo.selectedMeals.join(', ') }}
                    </span>
                    <span v-else>無</span>
                 </p>
              </div>
           </v-list-item>

           <!-- 每周體重紀錄 -->
           <v-list-item class="list-item">
              <div class="flex-container">
                 <h4 class="list-name">每周體重紀錄：</h4>
                 <p class="list-info50">{{ healthInfo.weight }} 公斤</p>
              </div>
           </v-list-item>

           <!-- HbA1C -->
           <v-list-item class="list-item">
              <div class="flex-container">
                 <h4 class="list-name">HbA1C：</h4>
                 <p class="list-info50">{{ healthInfo.hba1c }}？</p>
              </div>
           </v-list-item>
        </v-card>

        <!-- 編輯紀錄按鈕 -->
        <v-btn class="gotoMeet-btn" :ripple="false" @click="editHealthRecord">編輯健康紀錄</v-btn>
     </v-col>
  </v-row>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import localStorageService from './localStorageService.js';

export default {
   name: 'healthDetailViewPage',
   setup(){
    // Initialize healthInfo as an empty object instead of null
    const healthInfo = ref({}); // <- initialize as empty object
    const router = useRouter();

    const formattedDate = computed(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const date = urlParams.get('date');
        return new Date(date).toLocaleDateString();
    });

    const totalWalkingTime = computed(() => {
        if (healthInfo.value && healthInfo.value.walkingTimes) {
            return healthInfo.value.walkingTimes.reduce((total, time) => total + Number(time), 0);
        }
        return 0;
    });

    onMounted(() => {
        const data = localStorageService.getItem('healthInfo');
        if (data) {
            healthInfo.value = data;
        }
    });

    const isRedBg = (index) => {
        return {
            'form-group': true,
            'red-bg': index % 2 === 0
        };
    };

    const editHealthRecord = () => {
        router.push('/healthDetailForm');
    };

    return {
        healthInfo,
        formattedDate,
        totalWalkingTime,
        isRedBg,
        editHealthRecord
    };
},

};
</script>

<style scoped>
@import "../../assets/css/common.css";
@import "../../assets/css/meetInfo.css";
@import "../../assets/css/accountInfo.css";

/* common */
.list-title { 
   height: auto;
   padding: 1em;
   background-color: #e2e2e2;
}

.page-title { 
   font-size: 2.5em;
   margin-left: 0.1em;
}
/* common */

/* 自訂樣式調整 */

.hd-title{
    font-size: 2em;
  }
.gotoMeet-btn {
  color: #FFFFFF;
  background-color: #69c9a7;
  font-size: 2.5em;
  font-weight: 600;
  width: 100%;
  height: 2em !important;
  margin-top: 1em;
}

@media screen and (max-width: 1000px) {
  /* common */
  .list-title {
      height: auto;
      font-size: 1.3em;
   }

   .page-title {
      font-size: 1.5em;
      margin-left: 0.05em;
   }
/* common */
.hd-title{
    font-size: 1.3em;
  }
  .gotoMeet-btn {
      font-size: 2em;
      font-weight: 600;
      width: 100%;
      height: 2.5em !important;
   }
}
</style>
