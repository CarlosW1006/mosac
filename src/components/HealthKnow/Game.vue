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
                           'answered': answeredQuestions.includes(index),
                           'selected': selectedQuestion === index,
                           'glow': selectedQuestion === index
                        }"
                        class="grid-item"
                        @click="selectQuestion(index)"
                     >
                        問題{{ index }}
                     </button>
                  </div>

                  <!-- 問題區域 -->
                  <div v-if="selectedQuestion !== null" class="question-box mt-4">
                     <div class="question-title">問題 {{ selectedQuestion }}</div>
                     <p class="question-subtitle">{{ currentQuestions[selectedQuestion] }}</p>
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
                              'is-incorrect': option.isIncorrect,
                              'answered-option': isAnswered(selectedQuestion)
                           }"
                           >
                           <input
                              type="radio"
                              :value="option.value"
                              :disabled="isAnswered(selectedQuestion)"
                              v-model="selectedAnswer"
                           />
                           {{ option.label }}
                           </label>
                        </li>
                     </ul>
                     <!-- 只在未作答時顯示操作按鈕 -->
                    <template v-if="!isAnswered(selectedQuestion)">
                        <button @click="submitAnswer" class="btn btn-success mt-3">
                            送出答案
                        </button>

                        <button
                            @click="useElimination"
                            :disabled="eliminationUses === 0"
                            class="btn btn-warning mt-3 elimination-btn"
                        >
                            刪去法 (剩餘 {{ eliminationUses }} 次)
                        </button>
                    </template>
                    
                    <!-- 已作答題目顯示提示文字 -->
                    <div v-else class="answered-message mt-3">
                        此題已作答
                    </div>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
   <!-- 等待執行結果動畫 -->
   <isLoading :active="loading" color="#76caad"/>
   
   <!-- 彈跳視窗 -->
   <SweetModal 
        :isOpen="modalVisible"
        :message="modalMessage"
        :type="modalType"
        @close="modalVisible = false"
    />
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { 
    getUserInfo,
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
import SweetModal from './SweetModal.vue';

export default {
    name: 'gamePage',
    components: {
        SweetModal
    },
    setup() {
        // 用戶資訊
        const userPhase = ref(1);

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
        const loading = ref(false);

        // API數據相關
        const gameQuestions = ref([]);
        const currentQuestions = ref({});
        const currentOptionsContent = ref({});
        const currentCorrectAnswers = ref({});
        const originalQuestions = ref({});

        // 初始化遊戲數據
        const initializeGameData = async () => {
            loading.value = true;
            try {
                // 先獲取用戶資訊
                const userData = await getUserInfo();
                if (userData && userData.currentPhase) {
                    userPhase.value = Number(userData.currentPhase);
                }

                // 根據用戶階段獲取題目
                const response = await askGame(userPhase.value);
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
                console.error('初始化遊戲數據失敗:', error);
                if (error.message === 'Phase must be a number') {
                    alert('遊戲階段格式錯誤，請聯繫系統管理員');
                } else {
                    alert('獲取題目失敗，請稍後再試');
                }
            } finally {
                loading.value = false;
            }
        };

        // 上傳作答記錄
        const uploadGameRecord = async (questionNumber, selectedAnswer) => {
            try {
                const question = originalQuestions.value[questionNumber];
                if (!question) {
                    console.error('找不到題目資料:', questionNumber);
                    return;
                }

                const record = prepareGameRecord(question, selectedAnswer);
                console.log('準備上傳的記錄:', record); // 為了除錯，可以後續移除
                
                await submitGameRecord(record);
            } catch (error) {
                console.error('上傳作答記錄失敗:', error);
                // 可以根據錯誤類型顯示不同訊息
                if (error.response && error.response.status === 400) {
                    console.error('上傳的資料格式不正確:', error.response.data);
                }
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
                
                // 如果是已作答的題目，標記正確答案
                if (isAnswered(questionNumber)) {
                    const correctAnswer = currentCorrectAnswers.value[questionNumber];
                    shuffledOptions.value.forEach((opt) => {
                        if (opt.value === correctAnswer) {
                            opt.isCorrect = true;
                        }
                    });
                }
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
                showModal('請先選擇一個答案', 'info');
                return;
            }

            attempts.value[selectedQuestion.value]++;
            const correctAnswer = currentCorrectAnswers.value[selectedQuestion.value];
            questionAnswered.value = true;
            
            // 先判斷答案並立即顯示結果
            const isCorrect = checkAnswer(selectedAnswer.value, correctAnswer);
            if (isCorrect) {
                showModal('恭喜！你答對了', 'success');
                if (attempts.value[selectedQuestion.value] === 1) {
                    correctAnswersCount.value++;
                }
                answeredQuestions.value.push(selectedQuestion.value);
                
                shuffledOptions.value.forEach((opt) => {
                    if (opt.value === selectedAnswer.value) opt.isCorrect = true;
                });
            } else {
                showModal('很遺憾，你答錯了', 'error');
                shuffledOptions.value.forEach((opt) => {
                    if (opt.value === selectedAnswer.value) {
                        opt.locked = true;
                        opt.isIncorrect = true;
                    }
                });
            }

            try {
                // 背景處理 API 相關操作
                await uploadGameRecord(selectedQuestion.value, selectedAnswer.value);
                
                // 如果答對了，在上傳完成後再處理下一題
                if (isCorrect) {
                    const nextQuestion = getNextRandomQuestion(currentQuestions.value, answeredQuestions.value);
                    if (nextQuestion !== null) {
                        selectQuestion(nextQuestion);
                    } else {
                        checkAllAnswered();
                    }
                }
            } catch (error) {
                console.error('處理答案時發生錯誤:', error);
            } finally {
                questionAnswered.value = false;
            }
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
                showModal(`你已完成所有題目！正確率：${correctRate}%`, 'success');
            }
        };

        const isAnswered = (questionNumber) => {
            return answeredQuestions.value.includes(questionNumber);
        };

        // 組件掛載時初始化數據
        onMounted(() => {
            initializeGameData();
        });

        // 彈跳視窗
        const modalVisible = ref(false);
        const modalMessage = ref('');
        const modalType = ref('info');

        const showModal = (message, type = 'info') => {
            nextTick(() => {
                modalMessage.value = message;
                modalType.value = type;
                modalVisible.value = true;
            });
        };

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
            isAnswered,
            useElimination,
            loading,
            modalVisible,
            modalMessage,
            modalType,
            showModal,
        };
    },
};
</script>

<style scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/game.css";
</style>