import API from './apiInstance.js'; 

// 遊戲 API Start //
export function askGame(phase) {
    return API.get(
        'game/phase',
        {
            params: {
                phase: phase
            },
        }
    )
    .then(response => {
        if (response && response.data) {
            return response;
        }
        throw new Error('No data received');
    })
    .catch(error => {
        console.error('獲取遊戲題目失敗:', error);
        throw error;
    });
}
// 遊戲 API End //

// 上傳作答記錄 API Start //
export function submitGameRecord(recordData) {
    return API.post('game/record', recordData)
        .then(response => {
            if (response && response.data) {
                return response;
            }
            throw new Error('Failed to submit record');
        })
        .catch(error => {
            console.error('上傳作答記錄失敗:', error);
            throw error;
        });
}
// 上傳作答記錄 API End //

// 格式化 API 返回的題目數據 Start //
export function formatQuestions(apiData) {
    const questions = {};
    const correctAnswers = {};
    const optionsContent = {};
    const originalQuestions = {};  // 保存原始題目數據

    apiData.forEach(question => {
        const questionNumber = question.number;
        questions[questionNumber] = question.topic;
        optionsContent[questionNumber] = question.options.map(opt => opt.content);
        originalQuestions[questionNumber] = question;  // 保存完整的原始數據

        const correctOption = question.options.find(opt => opt.is_correct);
        if (correctOption) {
            correctAnswers[questionNumber] = correctOption.content;
        }
    });

    return { questions, correctAnswers, optionsContent, originalQuestions };
}

// 準備上傳的記錄數據 Start //
export function prepareGameRecord(question, selectedOption, allOptions) {
    return {
        number: question.number,
        topic: question.topic,
        phase: question.phase,
        options: allOptions.map(opt => ({
            number: opt.number,
            content: opt.content,
            is_correct: opt.is_correct,
            selected: opt.content === selectedOption
        }))
    };
}

// 打亂選項順序 Start //
export function shuffleOptions(content) {
    const options = ['A', 'B', 'C', 'D'];
    const shuffledContent = [...content].sort(() => Math.random() - 0.5);

    return options.map((label, index) => ({
        label: `${label}. ${shuffledContent[index]}`,
        value: shuffledContent[index],
        locked: false,
    }));
}

// 檢查答案 Start //
export function checkAnswer(selectedAnswer, correctAnswer) {
    return selectedAnswer === correctAnswer;
}

// 獲取隨機的下一題 Start //
export function getNextRandomQuestion(currentQuestions, answeredQuestions) {
    const remainingQuestions = Object.keys(currentQuestions).filter(
        (q) => !answeredQuestions.includes(Number(q))
    );

    if (remainingQuestions.length > 0) {
        return Number(remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)]);
    }
    return null;
}

// 計算正確率 Start //
export function calculateCorrectRate(correctCount, totalQuestions) {
    return ((correctCount / totalQuestions) * 100).toFixed(2);
}

// 使用刪去法時獲取要鎖定的選項 Start //
export function getOptionToLock(options, correctAnswer) {
    const incorrectOptions = options.filter(
        option => option.value !== correctAnswer && !option.locked
    );

    if (incorrectOptions.length > 0) {
        return incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    }
    return null;
}