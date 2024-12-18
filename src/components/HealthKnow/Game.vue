<template>
   <div class="container my-4">
     <h1>動動腦九宮格</h1>
    
     <!-- 進度條 -->
       <div class="progress-container my-3">
         <div class="progress-bar-wrapper">
           <div
             class="progress-bar-striped progress-bar-animated"
             :style="{ width: progressBarWidth + '%', '--progress-value': progressBarWidth }"
           >
             <!-- 文字隱藏直到進度條有數值後才顯示 -->
             <span class="progress-label" :class="{ show: progressBarWidth > 0 }">
               {{ progressBarWidth }}%
             </span>
           </div>
         </div>
       </div>
 
 
 
       <!-- 九宮格 -->
       <div class="grid-container">
         <button
           v-for="index in 9"
           :key="index"
           :class="{
             locked: answeredQuestions.includes(index),
             selected: selectedQuestion === index,
             glow: selectedQuestion === index
           }"
           class="grid-item"
           @click="selectQuestion(index)"
           :disabled="answeredQuestions.includes(index)"
         >
           問題{{ index }}
         </button>
       </div>
 
       <!-- 問題區域 -->
       <div v-if="selectedQuestion !== null" class="question-box mt-4">
         <div class="question-title">問題 {{ selectedQuestion }}</div>
         <p>{{ currentQuestion }}</p>
         <ul>
           <li
             v-for="(option, index) in shuffledOptions"
             :key="index"
             @click="selectOption(option)"
           >
             <label
               :class="{
                 'error-option': option.locked,
                 'is-selected': option.isSelected,
                 'is-correct': option.isCorrect,
                 'is-incorrect': option.isIncorrect
               }"
             >
               <input
                 type="radio"
                 :value="option.value"
                 :disabled="option.locked"
                 v-model="selectedAnswer"
               />
               {{ option.label }}
             </label>
           </li>
         </ul>
         <button @click="submitAnswer" class="btn btn-success mt-3">
           送出答案
         </button>
 
         <!-- 刪去法按鈕及使用次數顯示 -->
         <button
           @click="useElimination"
           :disabled="eliminationUses === 0"
           class="btn btn-warning mt-3 elimination-btn"
         >
           刪去法 (剩餘 {{ eliminationUses }} 次)
         </button>
       </div>
 
       <div v-if="allAnswered" class="text-center mt-4">
         <button @click="goBackToRecord" class="btn btn-primary">
           返回健康知能
         </button>
       </div>
 
       <!-- 取消遊戲按鈕 -->
       <div class="text-center mt-4" v-if="!allAnswered">
         <button @click="confirmCancel" class="btn btn-danger">取消遊戲</button>
       </div>
   </div>
 </template>

<script>
export default {
   name: 'gamePage',
   data() {
    return {
      selectedQuestion: null,
      currentQuestion: '',
      selectedAnswer: '',
      answeredQuestions: [], // 追踪已完成問題
      correctAnswersCount: 0, // 記錄第一次答對的題數
      attempts: {}, // 每個問題的嘗試次數
      eliminationUses: 2, // 刪去法功能的使用次數
      questionAnswered: false, // 防止未完成問題前切換題目
      correctAnswers: {
        1: '時常精神緊繃',
        2: '選項B',
        9: '選項B',
      },
      questions: {
        1: '下列者不是預防高血壓的方法？',
        2: '選項B',
        9: '問題九的描述',
      },
      optionsContent: {
        1: ['多吃蔬菜、水果', '避免太鹹的食物', '避免過度疲勞', '時常精神緊繃'],
        2:['選項A', '選項B', '選項C', '選項D'],
        9: ['選項A', '選項B', '選項C', '選項D'],
      },
      shuffledOptions: [], // 當前問題的隨機選項
      allAnswered: false,
    };
  },
  computed: {
    progressBarWidth() {
      return Math.round(
        (this.answeredQuestions.length / Object.keys(this.questions).length) * 100
      );
    },
  },
  methods: {
    selectQuestion(questionNumber) {
      this.selectedQuestion = questionNumber;
      this.currentQuestion = this.questions[questionNumber];
      this.selectedAnswer = ''; // 清空選擇的答案
      this.shuffleOptions(); // 隨機排列選項

      // 初始化該問題的嘗試次數
      if (!this.attempts[questionNumber]) {
        this.attempts[questionNumber] = 0;
      }
    },
    shuffleOptions() {
      const content = this.optionsContent[this.selectedQuestion];
      const options = ['A', 'B', 'C', 'D'];
      const shuffledContent = [...content].sort(() => Math.random() - 0.5);

      this.shuffledOptions = options.map((label, index) => {
        return {
          label: `${label}. ${shuffledContent[index]}`,
          value: shuffledContent[index],
          locked: false, // 初始時選項未鎖定
        };
      });
    },
    selectOption(option) {
      if (!option.locked) {
        this.selectedAnswer = option.value;
        this.shuffledOptions.forEach((opt) => {
          opt.isSelected = opt.value === option.value;
        });
      }
    },
    submitAnswer() {
      if (!this.selectedAnswer) {
        alert('請先選擇一個答案');
        return;
      }

      this.attempts[this.selectedQuestion]++;
      const correctAnswer = this.correctAnswers[this.selectedQuestion];
      this.questionAnswered = true; // 標記問題已回答

      if (this.selectedAnswer === correctAnswer) {
        alert('恭喜！你答對了');
        if (this.attempts[this.selectedQuestion] === 1) {
          this.correctAnswersCount++;
        }
        this.answeredQuestions.push(this.selectedQuestion);
        this.shuffledOptions.forEach((opt) => {
          if (opt.value === this.selectedAnswer) {
            opt.isCorrect = true; // 標記正確選項
          }
        });

        const remainingQuestions = Object.keys(this.questions).filter(
          (q) => !this.answeredQuestions.includes(Number(q))
        );
        if (remainingQuestions.length > 0) {
          const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
          this.selectQuestion(Number(nextQuestion));
        } else {
          this.checkAllAnswered();
        }
      } else {
        alert('很遺憾，你答錯了');
        this.shuffledOptions.forEach((opt) => {
          if (opt.value === this.selectedAnswer) {
            opt.locked = true;
            opt.isIncorrect = true; // 標記錯誤選項
          }
        });
      }

      this.questionAnswered = false; // 標記問題結束
    },
    useElimination() {
      if (this.eliminationUses > 0) {
        // 篩選出尚未被鎖定的錯誤選項
        const incorrectOptions = this.shuffledOptions.filter(
          (option) => option.value !== this.correctAnswers[this.selectedQuestion] && !option.locked
        );

        if (incorrectOptions.length > 0) {
          // 隨機刪除一個錯誤選項
          const optionToLock = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
          optionToLock.locked = true;

          // 減少刪去法次數
          this.eliminationUses--;
        }
      }
    },
    checkAllAnswered() {
      if (this.answeredQuestions.length === Object.keys(this.questions).length) {
        this.allAnswered = true;
        const correctRate = (
          (this.correctAnswersCount / Object.keys(this.questions).length) *
          100
        ).toFixed(2);
        alert(`你已全部答對！正確率：${correctRate}%`);
      }
    },
    goBackToRecord() {
      this.$router.push('/healthKnowledge');
    },
    confirmCancel() {
      if (confirm('你確定要放棄挑戰嗎？')) {
        this.$router.push('/healthKnowledge');
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.grid-item {
  background-color: #f08080;
  border: none;
  padding: 20px;
  font-size: 18px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.grid-item:hover {
  background-color: #ff7f7f;
}

.grid-item.selected {
  background-color: #ffcccc;
}

.grid-item.locked {
  background-color: #d3d3d3;
  cursor: not-allowed;
}

.grid-item.glow {
  box-shadow: 0 0 15px 5px rgba(255, 127, 127, 0.8);
}

.question-box {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.question-box:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.question-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

label {
  font-size: 18px;
  color: #555;
  cursor: pointer;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

label:hover {
  background-color: #e0f7fa;
}

label.is-selected {
  background-color: #e0f7fa;
}

label.error-option {
  text-decoration: line-through;
  color: #d9534f;
}

label.is-correct {
  background-color: #d4edda;
}

label.is-incorrect {
  background-color: #f8d7da;
  text-decoration: line-through;
}

/* 進度條容器加上灰白色外框和陰影 */
.progress-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  background-color: #f2f2f2; /* 外框的灰白色 */
  padding: 3px; /* 外框的厚度 */
}

/* 內層底色為白色 */
.progress-bar-wrapper {
  background-color: #ffffff;
  border-radius: 5px;
  position: relative;
  height: 30px; /* 調整進度條高度 */
  overflow: hidden;
}

/* 進度條 */
.progress-bar-striped {
  height: 100%;
  background-image: linear-gradient(
   
  );
  background-size: 20px 20px; /* 調整條紋密集度 */
  border-radius: 5px;
 
}


/* 使用CSS變數和HSL控制顏色變化 */
.progress-bar-striped {
  --progress-empty-color-h: 4.1;
  --progress-empty-color-s: 89.6;
  --progress-empty-color-l: 58.4;
  --progress-filled-color-h: 122.4;
  --progress-filled-color-s: 39.4;
  --progress-filled-color-l: 49.2;
  background-color: hsl(
    calc((var(--progress-empty-color-h) + (var(--progress-filled-color-h) - var(--progress-empty-color-h)) * (var(--progress-value) / 100)) * 1deg),
    calc((var(--progress-empty-color-s) + (var(--progress-filled-color-s) - var(--progress-empty-color-s)) * (var(--progress-value) / 100)) * 1%),
    calc((var(--progress-empty-color-l) + (var(--progress-filled-color-l) - var(--progress-empty-color-l)) * (var(--progress-value) / 100)) * 1%)
  );
}

/* 進度文字居中顯示在進度條變色部分 */
.progress-label {
  color: #3f0e0e;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 完全水平和垂直居中 */
  white-space: nowrap; /* 防止文字換行 */
  z-index: 1; /* 保證文字顯示在進度條上方 */
  pointer-events: none; /* 禁止文字影響點擊行為 */
}



.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: block;
  width: 100%;
  margin-top: 20px;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #ff6666;
  border-color: #ff6666;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #ff3333;
}

.elimination-btn {
  background-color: #ffc107;
  border-color: #ffc107;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: block;
  width: 100%;
  margin-top: 10px;
}

.elimination-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>