<template>
   <div class="page-tab flex-container">
      <a href="#/healthKnowledge" class="tab-L">回到健康知能</a>
      <p class="tab-R">健康知能＞動動腦九宮格</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" md="7" lg="7">
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
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { 
   askGame,
    submitGameRecord,
    formatQuestions, 
    shuffleOptions,
    checkAnswer,
    getNextRandomQuestion,
    calculateCorrectRate,
    getOptionToLock,
    prepareGameRecord
} from '../../api/game.js';

export default {
    name: 'gamePage',
    setup() {
        // 基本遊戲狀態
        const selectedQuestion = ref(null);
        const selectedAnswer = ref('');
        const answeredQuestions = ref([]);
        const correctAnswersCount = ref(0);
        const attempts = ref({});
        const eliminationUses = ref(2);
        const questionAnswered = ref(false);
        const allAnswered = ref(false);
        const shuffledOptions = ref([]);

        // API數據相關
        const gameQuestions = ref([]);
        const currentQuestions = ref({});
        const currentOptionsContent = ref({});
        const currentCorrectAnswers = ref({});
        const originalQuestions = ref({});

        // 初始化遊戲數據
        const initializeGameData = async () => {
            try {
                const response = await askGame("1");
                if (response && response.data) {
                    gameQuestions.value = response.data;
                    const { questions, correctAnswers, optionsContent, originalQuestions: origQuestions } = 
                        formatQuestions(gameQuestions.value);
                    
                    currentQuestions.value = questions;
                    currentCorrectAnswers.value = correctAnswers;
                    currentOptionsContent.value = optionsContent;
                    originalQuestions.value = origQuestions;
                }
            } catch (error) {
                alert('獲取題目失敗，請稍後再試');
            }
        };

        // 上傳作答記錄
        const uploadGameRecord = async (questionNumber, selectedAnswer) => {
            try {
                const question = originalQuestions.value[questionNumber];
                const record = prepareGameRecord(
                    question,
                    selectedAnswer,
                    question.options
                );
                await submitGameRecord(record);
            } catch (error) {
                console.error('上傳作答記錄失敗:', error);
            }
        };

        // 計算進度條寬度
        const progressBarWidth = computed(() => {
            const totalQuestions = Object.keys(currentQuestions.value).length;
            return totalQuestions ? Math.round((answeredQuestions.value.length / totalQuestions) * 100) : 0;
        });

        // 選擇題目
        const selectQuestion = (questionNumber) => {
            if (currentQuestions.value[questionNumber]) {
                selectedQuestion.value = questionNumber;
                selectedAnswer.value = '';
                
                if (!attempts.value[questionNumber]) {
                    attempts.value[questionNumber] = 0;
                }
                
                const content = currentOptionsContent.value[selectedQuestion.value];
                shuffledOptions.value = shuffleOptions(content);
            }
        };

        // 選擇選項
        const selectOption = (option) => {
            if (!option.locked) {
                selectedAnswer.value = option.value;
                shuffledOptions.value.forEach((opt) => {
                    opt.isSelected = opt.value === option.value;
                });
            }
        };

        // 提交答案
        const submitAnswer = async () => {
            if (!selectedAnswer.value) {
                alert('請先選擇一個答案');
                return;
            }

            attempts.value[selectedQuestion.value]++;
            const correctAnswer = currentCorrectAnswers.value[selectedQuestion.value];
            questionAnswered.value = true;

            // 上傳作答記錄
            await uploadGameRecord(selectedQuestion.value, selectedAnswer.value);

            if (checkAnswer(selectedAnswer.value, correctAnswer)) {
                alert('恭喜！你答對了');
                if (attempts.value[selectedQuestion.value] === 1) {
                    correctAnswersCount.value++;
                }
                answeredQuestions.value.push(selectedQuestion.value);
                
                shuffledOptions.value.forEach((opt) => {
                    if (opt.value === selectedAnswer.value) opt.isCorrect = true;
                });

                const nextQuestion = getNextRandomQuestion(currentQuestions.value, answeredQuestions.value);
                if (nextQuestion !== null) {
                    selectQuestion(nextQuestion);
                } else {
                    checkAllAnswered();
                }
            } else {
                alert('很遺憾，你答錯了');
                shuffledOptions.value.forEach((opt) => {
                    if (opt.value === selectedAnswer.value) {
                        opt.locked = true;
                        opt.isIncorrect = true;
                    }
                });
            }
            questionAnswered.value = false;
        };

        // 使用刪去法
        const useElimination = () => {
            if (eliminationUses.value > 0) {
                const optionToLock = getOptionToLock(
                    shuffledOptions.value, 
                    currentCorrectAnswers.value[selectedQuestion.value]
                );

                if (optionToLock) {
                    optionToLock.locked = true;
                    eliminationUses.value--;
                }
            }
        };

        // 檢查是否所有題目都已回答
        const checkAllAnswered = () => {
            const totalQuestions = Object.keys(currentQuestions.value).length;
            if (answeredQuestions.value.length === totalQuestions) {
                allAnswered.value = true;
                const correctRate = calculateCorrectRate(correctAnswersCount.value, totalQuestions);
                alert(`你已完成所有題目！正確率：${correctRate}%`);
            }
        };

        // 組件掛載時初始化數據
        onMounted(() => {
            initializeGameData();
        });

        return {
            selectedQuestion,
            selectedAnswer,
            answeredQuestions,
            correctAnswersCount,
            attempts,
            eliminationUses,
            questionAnswered,
            allAnswered,
            shuffledOptions,
            currentQuestions,
            progressBarWidth,
            selectQuestion,
            selectOption,
            submitAnswer,
            useElimination,
        };
    },
};
</script>

<style scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/game.css";
</style>