import axios from 'axios';
// const APIUrl = 'http://localhost:3000/';
const APIUrl = 'http://172.20.10.9:3000/';

// 取得帳號資料 API Start //
export function askAccInfo() {
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'user',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      const credential = response.data.credential;
      const userType = { 0: "一般用戶", 2: "專家帳號", 3: "系統管理者"}[response.data.userType];
      const name = response.data.name;
      const nickName = response.data.nickname;

      return { credential, name, userType, nickName };
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員' + error);
      }
   });
}
// 取得帳號資料 API End //

// 取得目標資料 API Start //
export function askTargetInfo() {
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'user/health-targets?latest=true',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => { 
      console.log(response)
      const currentPhase = { 0: "意圖前期", 1: "意圖期", 2: "準備期", 3: "行動期", 4: "維持期" }[response.data[0].phase];
      const currentWeight = response.data[0].weeklyWeight;
      const currentSteps = response.data[0].dailySteps;
      const currentJogTime = response.data[0].dailyJoggingTime;

      return { currentPhase, currentWeight, currentSteps, currentJogTime };
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員' + error);
      }
   });
}
// 取得目標資料 API End //

// 儲存帳號資料 API Start //
export function changeAccInfo(accNickName) { 
   const token = sessionStorage.getItem('session');
   const credential = sessionStorage.getItem('credential');
   return axios.patch(
      APIUrl + 'user',
      {
         credential: credential,
         nickname: accNickName,
      },
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then(() => {
      alert('資料變更成功');
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員' + error);
      }
   });
}
// 儲存帳號資料 API End //
