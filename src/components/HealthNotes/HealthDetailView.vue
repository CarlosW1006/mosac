<template>

  <div class="health-detail">
      <h1>健康手札</h1>
      <div v-if="healthInfo">
        <h2>{{ formattedDate }} 健康紀錄</h2>
        <!-- 健康紀錄 -->
        <div class="record-section">
          <div class="form-group" :class="isRedBg(0)">
            <p><strong>每日步數：</strong> {{ healthInfo.steps }} 步</p>
          </div>
          <div class="form-group" :class="isRedBg(1)">
            <p><strong>每日慢跑時間：</strong>{{ totalWalkingTime }} 分鐘</p>
          </div>
          <div class="form-group" :class="isRedBg(2)">
            <p class="diet-goal">
              <strong>每日飲食目標：</strong>
              <span v-if="healthInfo.selectedMeals && healthInfo.selectedMeals.length > 0">
              {{ healthInfo.selectedMeals.join(', ') }}
              </span>
              <span v-else>無</span>
            </p>       
          </div>
          <div class="form-group" :class="isRedBg(3)">
            <p><strong>每周體重紀錄：</strong> {{ healthInfo.weight }} 公斤</p>
          </div>
          <div class="form-group" :class="isRedBg(4)">
            <p><strong>HbA1C：</strong> {{ healthInfo.hba1c }} ?</p>
          </div>
        </div>
        <button @click="editHealthRecord" type="submit" class="save-button">編輯健康紀錄</button>
      </div>
      <div v-else>
        <p>無健康紀錄</p>        
      </div>
  </div>

  
</template>
  
<script>
import localStorageService from './localStorageService.js';

export default {
    name: 'healthDetailViewPage',
    data() {
      return {
        healthInfo: null
      };
    },
    computed: {
      formattedDate() {
        const urlParams = new URLSearchParams(window.location.search);
        const date = urlParams.get('date');
        return new Date(date).toLocaleDateString();
      },
      totalWalkingTime() {
        // 計算慢跑時間的總和
        if (this.healthInfo && this.healthInfo.walkingTimes) {
            return this.healthInfo.walkingTimes.reduce((total, time) => total + Number(time), 0);
        }
        return 0;
      },
    },
    created() {
        // 在組件創建時從 localStorage 獲取健康資料
        this.healthInfo = localStorageService.getItem('healthInfo');
    },
    methods: {
      isRedBg(index) {
        // 使用物件語法動態綁定 class，將不同樣式整合
        return {
          'form-group': true,
          'red-bg': index % 2 === 0 // 偶數索引顯示紅色背景
        };
      },
      editHealthRecord() {
        // 跳轉到 HealthDetailForm
        this.$router.push('/health-detail-form');
      }
    }
};
</script>
  
<style>
.grid-item:nth-child(1) {
  background-color: #d1d3d4;
}



.health-detail {
  margin: 1.4em;
  padding: 1.4em;
}
  
.health-detail h2 {
  color: #898989;
  margin-top: 0.4em;
}
  
h1 {
  color: #000000;
  font-size: 1.5rem;
}
  
h2 {
  font-size: 1.2rem;
  margin-bottom: 1.4em;
}
  
.record-section {
  margin-bottom: 2.1em;
  border: 0.1em solid #c6c3c3;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
  
.form-group {
  padding: 0.7em;
  background-color: #fff;
}

.red-bg {
  background-color: #ffe6e6;
}

.diet-goal {
  display: flex;
  align-items: center;
  margin: 0;
  height: 2.45em;
}

p {
  margin: 0.5em 0;
}
  
strong {
  font-weight: bold;
  margin-right: 0.5em;
}

.save-button {
  background-color: #ff6666;
  color: white;
  padding: 0.7em 1.4em;
  border: none;
  border-radius: 0.35em;
  cursor: pointer;
  width: 100%; /* 讓按鈕的寬度與表單一致 */
  box-sizing: border-box; /* 確保 padding 不會超出寬度 */
}

.save-button:hover {
  background-color: #ff3333;
}
</style>
  