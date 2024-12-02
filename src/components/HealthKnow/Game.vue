<template>
   <div class="page-tab flex-container">
      <a href="#/healthKnowledge" class="tab-L">回到健康知能</a>
      <p class="tab-R">健康知能＞動動腦九宮格</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title list-title-know">
               <h3 class="page-title">動動腦九宮格</h3>
            </v-list-item>

            <v-list-item>
               <div class="container my-4">
                  
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
                     <p class="question-subtitle">{{ currentQuestion }}</p>
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
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
   import { ref, computed } from 'vue';
   import { useRouter } from 'vue-router';

   export default {
      name: 'gamePage',
      setup() {
         const router = useRouter();
         const selectedQuestion = ref(null);
         const currentQuestion = ref('');
         const selectedAnswer = ref('');
         const answeredQuestions = ref([]);
         const correctAnswersCount = ref(0);
         const attempts = ref({});
         const eliminationUses = ref(2);
         const questionAnswered = ref(false);
         const allAnswered = ref(false);
         const shuffledOptions = ref([]);
         const correctAnswers = {
         1: '時常精神緊繃',
         2: '選項B',
         9: '選項B',
         };
         const questions = {
         1: '下列者不是預防高血壓的方法？',
         2: '選項B',
         9: '問題九的描述',
         };
         const optionsContent = {
         1: ['多吃蔬菜、水果', '避免太鹹的食物', '避免過度疲勞', '時常精神緊繃'],
         2: ['選項A', '選項B', '選項C', '選項D'],
         9: ['選項A', '選項B', '選項C', '選項D'],
         };

         const progressBarWidth = computed(() =>
         Math.round((answeredQuestions.value.length / Object.keys(questions).length) * 100)
         );

         const selectQuestion = (questionNumber) => {
         selectedQuestion.value = questionNumber;
         currentQuestion.value = questions[questionNumber];
         selectedAnswer.value = '';
         shuffleOptions();

         if (!attempts.value[questionNumber]) {
            attempts.value[questionNumber] = 0;
         }
         };

         const shuffleOptions = () => {
         const content = optionsContent[selectedQuestion.value];
         const options = ['A', 'B', 'C', 'D'];
         const shuffledContent = [...content].sort(() => Math.random() - 0.5);

         shuffledOptions.value = options.map((label, index) => ({
            label: `${label}. ${shuffledContent[index]}`,
            value: shuffledContent[index],
            locked: false,
         }));
         };

         const selectOption = (option) => {
         if (!option.locked) {
            selectedAnswer.value = option.value;
            shuffledOptions.value.forEach((opt) => {
               opt.isSelected = opt.value === option.value;
            });
         }
         };

         const submitAnswer = () => {
         if (!selectedAnswer.value) {
            alert('請先選擇一個答案');
            return;
         }

         attempts.value[selectedQuestion.value]++;
         const correctAnswer = correctAnswers[selectedQuestion.value];
         questionAnswered.value = true;

         if (selectedAnswer.value === correctAnswer) {
            alert('恭喜！你答對了');
            if (attempts.value[selectedQuestion.value] === 1) {
               correctAnswersCount.value++;
            }
            answeredQuestions.value.push(selectedQuestion.value);
            shuffledOptions.value.forEach((opt) => {
               if (opt.value === selectedAnswer.value) opt.isCorrect = true;
            });
            const remainingQuestions = Object.keys(questions).filter(
               (q) => !answeredQuestions.value.includes(Number(q))
            );
            if (remainingQuestions.length > 0) {
               const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
               selectQuestion(Number(nextQuestion));
            } else {
               checkAllAnswered();
            }
         } else {
            alert('很遺憾，你答錯了');
            shuffledOptions.value.forEach((opt) => {
               if (opt.value === selectedAnswer.value) opt.locked = true;
            });
         }
         questionAnswered.value = false;
         };

         const useElimination = () => {
         if (eliminationUses.value > 0) {
            const incorrectOptions = shuffledOptions.value.filter(
               (option) => option.value !== correctAnswers[selectedQuestion.value] && !option.locked
            );

            if (incorrectOptions.length > 0) {
               const optionToLock = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
               optionToLock.locked = true;
               eliminationUses.value--;
            }
         }
         };

         const checkAllAnswered = () => {
         if (answeredQuestions.value.length === Object.keys(questions).length) {
            allAnswered.value = true;
            const correctRate = (
               (correctAnswersCount.value / Object.keys(questions).length) *
               100
            ).toFixed(2);
            alert(`你已全部答對！正確率：${correctRate}%`);
         }
         };

         const goBackToRecord = () => {
         router.push('/healthKnowledge');
         };

         const confirmCancel = () => {
         if (confirm('你確定要放棄挑戰嗎？')) {
            router.push('/healthKnowledge');
         }
      };

      return {
         selectedQuestion,
         currentQuestion,
         selectedAnswer,
         answeredQuestions,
         correctAnswersCount,
         attempts,
         eliminationUses,
         questionAnswered,
         allAnswered,
         shuffledOptions,
         progressBarWidth,
         selectQuestion,
         shuffleOptions,
         selectOption,
         submitAnswer,
         useElimination,
         checkAllAnswered,
         goBackToRecord,
         confirmCancel,
         };
      },
   };
</script>

<style scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/game.css";
</style>