import API from './apiInstance.js';

// 取得帳號資料 API
export function askAccInfo() { 
   return API.get('user').then((response) => { 
      const credential = response.data.credential;
      const userType = { 0: "一般用戶", 1: "專家帳號", 2: "系統管理者"}[response.data.userType];
      const name = response.data.name;
      const blockname = response.data.name[0] + 'Ｏ' + response.data.name.slice(2);
      const nickname = response.data.nickname;
      const totalPoints = response.data.totalPoints;
      const totalMedals = response.data.totalMedals;

      return { credential, userType, name, blockname, nickname, totalPoints, totalMedals };
   })
}

// 取得目標資料 API
export function askTargetInfo() {
   return API.get('user/health-targets?latest=true')
      .then((response) => {
         // 初始化變數，設置默認值
         let currentPhase = 'none';
         let currentWeight = 'none';
         let currentSteps = 'none';
         let currentJogTime = 'none';

         const targetData = response.data && response.data[0];

         if (targetData) {
            currentPhase = { 0: "意圖前期", 1: "意圖期", 2: "準備期", 3: "行動期", 4: "維持期" }[targetData.phase] || 'none';
            currentWeight = targetData.weeklyWeight || 'none';
            currentSteps = targetData.dailySteps || 'none';
            currentJogTime = targetData.dailyJoggingTime || 'none';
         }

         return { currentPhase, currentWeight, currentSteps, currentJogTime };
      })
}

// 儲存帳號資料 API
export function changeAccInfo(accNickName) { 
   const credential = sessionStorage.getItem('credential');
   return API.patch('user',
      {
         credential: credential,
         nickname: accNickName,
      }
   )
   .then(() => {
      alert('資料變更成功');
   })
}

// 點數兌換紀錄 API
export function askPointsRecord() {
   return API.get('user/point-records').then((response) => { 
      const pointsRecord = {};

      if(Array.isArray(response.data)) {
         response.data.forEach(record => {
            // 篩選 operationType === 1 的資料
            if(record.operationType === 1) {
               const rawDate = new Date(record.createAt);
               // 格式化日期為 'YYYY/MM/DD HH:mm'
               const formattedDate = rawDate.getFullYear() + '/' +
               (rawDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
               rawDate.getDate().toString().padStart(2, '0') + ' ' +
               rawDate.getHours().toString().padStart(2, '0') + ':' +
               rawDate.getMinutes().toString().padStart(2, '0') + ':' +
               rawDate.getSeconds().toString().padStart(2, '0');
               
               const key = formattedDate;
      
               if(!pointsRecord[key]) {
                  pointsRecord[key] = [];
               }
               pointsRecord[key].push(record);
            }
         });
      }

      const result = Object.entries(pointsRecord).map(([createAt, records]) => ({
         createAt, records
      }));

      return result;
   })
}

// 兌換點數 API
export function exchangePoints() {
   return API.post('user/points/exchange',
      { }, // 傳送空的 body //
   )
   .then((response) => {
      console.log(response);
   })
}
