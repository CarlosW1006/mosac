<template>
<div class="health-detail">
   <h1>健康手札</h1>
   <h2>{{ formattedDate }} 健康紀錄</h2>

   <!-- 健康紀錄表單 -->
   <form @submit.prevent="saveHealthInfo">
   <!-- 每日記錄區塊 -->
   <h4>每日記錄</h4>
   <div class="record-section">
      <div class="form-group" :class="{'red-bg': isRedBg(0)}">
         <label for="steps">每日步數：</label>
         <div class="input-unit-wrapper">
         <input type="number" id="steps" v-model="healthInfo.steps" placeholder="輸入步數" />
         <span class="unit">步</span>
         </div>
      </div>

      <div class="form-group" :class="{'red-bg': isRedBg(1)}">
         <label for="walkingTime">每日慢跑時間：</label>
         <div v-for="(time, index) in healthInfo.walkingTimes" :key="index" class="input-unit-wrapper">
         <input type="number" v-model="healthInfo.walkingTimes[index]" placeholder="輸入時間" />
         <span class="unit">分鐘</span>
         </div>
         <button @click.prevent="addWalkingTime">+</button>
      </div>

      <div class="form-group" :class="{'red-bg': isRedBg(2)}">
         <label>每日飲食目標(符合 211 餐盤)：</label>
         <div class="diet-options">
         <input type="radio" id="dietNo" value="否" v-model="healthInfo.diet" />
         <label for="dietNo">否；</label>

         <input type="radio" id="dietYes" value="是" v-model="healthInfo.diet" />
         <label for="dietYes">是</label>

         <!-- 早餐、午餐、晚餐在同一行 -->
         <span class="checkbox-group" v-if="healthInfo.diet === '是'">
            (
            <input type="checkbox" v-model="healthInfo.breakfast" />
            <label>早餐</label>
            <input type="checkbox" v-model="healthInfo.lunch" />
            <label>午餐</label>
            <input type="checkbox" v-model="healthInfo.dinner" />
            <label>晚餐</label>
            )
         </span>
         </div>
      </div>
   </div>

   <!-- 每周體重紀錄區塊 -->
   <h4>每周體重紀錄</h4>
   <div class="record-section">      
      <div class="form-group" :class="{'red-bg': isRedBg(4)}">
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
      <div class="form-group" :class="{'red-bg': isRedBg(6)}">
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
</template>

<script>
   export default {
      name: 'HealthDetailForm',
      data() {
         return {
            healthInfo: {
               steps: '',
               walkingTimes: [0],
               diet: '',
               breakfast: false,
               lunch: false,
               dinner: false,
               weight: '',
               hba1c: ''
            }
         };
      },
      computed: {
         formattedDate() {
         const urlParams = new URLSearchParams(window.location.search);
         const date = urlParams.get('date');
            return new Date(date).toLocaleDateString();
         }
      },
      methods: {
         saveHealthInfo() {
            console.log('保存的健康紀錄:', this.healthInfo);
            // 在這裡處理表單保存
         },
            addWalkingTime() {
            // 向 walkingTimes 陣列中添加一個新的空的輸入框
         this.healthInfo.walkingTimes.push(0);
         },
            isRedBg(index) {
            // 根據索引決定是否顯示紅色背景，奇數索引顯示紅色
         return index % 2 === 0;
         }
      }
   };
</script>

<style scoped>
   .health-detail {
   margin: 1.4em;
   padding: 1.4em;
   }

   .health-detail h2{
   color: #ababab;
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
   }

   .form-group {
   padding: 0.7em;
   background-color: #fff;
   }

   .red-bg {
   background-color: #ffe6e6;
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
   input[type="text"],
   textarea {
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
   white-space: nowrap; /* 防止單位文字換行 */
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

   /* button {
   margin-top: 0.7em;
   } */

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
