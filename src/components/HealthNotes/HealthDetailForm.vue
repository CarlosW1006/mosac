<template>
  <v-container fluid>
    <div class="health-detail">
      <h1>健康手札</h1>
      <h2>{{ formattedDate }} 健康紀錄</h2>
  
      <!-- 健康紀錄表單 -->
      <form @submit.prevent="saveHealthInfo">
        <!-- 每日記錄區塊 -->
        <h4>每日記錄</h4>
        <div class="record-section">
          <div class="form-group" :class="isRedBg(0)">
            <label for="steps">每日步數：</label>
            <div class="input-unit-wrapper">
              <input type="number" id="steps" v-model="healthInfo.steps" placeholder="輸入步數" />
              <span class="unit">步</span>
            </div>
          </div>
  
          <div class="form-group" :class="isRedBg(1)">
            <label for="walkingTime">每日慢跑時間：</label>
            <div v-for="(time, index) in healthInfo.walkingTimes" :key="index" class="input-unit-wrapper">
              <input type="number" v-model="healthInfo.walkingTimes[index]" placeholder="輸入時間" />
              <span class="unit">分鐘</span>
              <!-- 只有 index > 0 時顯示刪除按鈕 -->
              <button v-if="index > 0" @click.prevent="removeWalkingTime(index)" class="btn-round">X</button>
            </div>
            <button @click.prevent="addWalkingTime">+</button>
          </div>
  
          <div class="form-group" :class="isRedBg(2)">
            <label>每日飲食目標(符合 211 餐盤)：</label>
            <div class="diet-options">
              <input type="radio" id="dietNo" value="否" v-model="healthInfo.diet" />
              <label for="dietNo">否；</label>
  
              <input type="radio" id="dietYes" value="是" v-model="healthInfo.diet" />
              <label for="dietYes">是</label>
  
              <!-- 早餐、午餐、晚餐在同一行 -->
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
  
        <!-- 每周體重紀錄區塊 -->
        <h4>每周體重紀錄</h4>
        <div class="record-section">      
          <div class="form-group" :class="isRedBg(4)">
            <label for="weight">每周體重紀錄：</label>
            <div class="input-unit-wrapper">
              <input type="number" id="weight" v-model="healthInfo.weight" placeholder="輸入體重" />
              <span class="unit">公斤</span>
            </div>
          </div>
        </div>
  
        <!-- 每3個月HbA1C紀錄區塊 -->
        <h4>每3個月HbA1C紀錄</h4>
        <div class="record-section">               
          <div class="form-group" :class="isRedBg(6)">
            <label for="hba1c">HbA1C：</label>
            <div class="input-unit-wrapper">
              <input type="text" id="hba1c" v-model="healthInfo.hba1c" placeholder="輸入HbA1C數值" />
              <span class="unit">?</span>
            </div>
          </div>
        </div>
        <button type="submit" class="save-button">保存</button>
      </form>
    </div>
  </v-container>  
</template>
  
<script>
  import { ref,computed } from 'vue';
  import { useRouter } from 'vue-router';
  import localStorageService from './localStorageService.js';
  
  export default {
    name: 'healthDetailFormPage',
    setup() {
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
  
<style>
  .health-detail {
    margin: 1.4em;
    padding: 1.4em;
  }
  
  .health-detail h2{
    color: #ababab;
    margin-top: 0.4em;
    font-size: 1.2rem;
    margin-bottom: 1.4em;
  }
  
  h1 {
    color: #000000;
    font-size: 1.5rem;
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
    background-color: #dfdbdb;
  }
  
  label {
    font-weight: bold;
  }
  
  .input-unit-wrapper {
    display: flex;
    align-items: center;
  }
  /* 隱藏輸入欄位右側的上下箭頭 */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0; 
  }
  
  input[type="number"],
  input[type="text"] {
    flex: 1; /* 自動擴展填滿空間 */
    width: 100%;
    padding: 0.35em;
    margin-top: 0.35em;
    background-color: #fff;
    border: 0.01rem solid #000000;
    margin-bottom: 0.3em;
    max-width: calc(100% - 3em); /* 確保單位文字不會擠壓 input */
  }
  
  .unit {
    margin-left: 0.4em;
    margin-right: 0.4em;
    white-space: nowrap; /* 防止單位文字換行 */
  }
  
  .btn-round {
    border: solid 0.01em#f37e7e;
    border-radius: 50%;
    color: #f37e7e;
    cursor: pointer;
    width: 1.5em;
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    font-weight: bold;
  }
  
  input[type="radio"]{
    margin-right: 0.3em;
  }
  
  .checkbox-group label {
    margin-right: 0.35em;
  }
  
  .diet-options {
    display: flex;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 0.2em;
  }
  
  .checkbox-group {
    margin-left: 0.7em;
    display: flex;
    align-items: center;
  }
  
  .checkbox-group label,
  .checkbox-group input {
    margin-left: 0.35em;
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
  