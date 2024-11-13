import axios from 'axios';
// const APIUrl = 'http://localhost:8888/';
const APIUrl = 'http://172.20.10.9:8888/';

// 取得帳號資料 API Start //
export function askAccInfo() {
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'responseAccInfo',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      const data = response.data.data[0]
      const accName = data.accName;
      const acc_type = { 1: "管理者", 2: "一般使用者", 3: "諮詢專家"}[data.acc_type];
      const accFullName = data.accFullName;
      const accNickName = data.accNickName;
      const recent_range = { 1: "意圖前期", 2: "意圖期", 3: "準備期", 4: "行動期", 5: "維持期" }[data.recent_range];
      const target_weight = data.target_weight;
      const target_walk = data.target_walk;
      const target_jog = data.target_jog;

      return { accName, acc_type, accFullName, accNickName, recent_range, target_weight, target_walk, target_jog };
   })
   .catch((error) => {
      alert('資料處理發生異常，請聯絡系統管理員 ', error);
      throw error;
   });
}
// 取得帳號資料 API End //

// 儲存帳號資料 API Start //
export function changeAccInfo(accNickName) { 
   const token = sessionStorage.getItem('session');
   return axios.post(
      `${APIUrl}/users/${token}/updateUserInfo`, 
      { nickname: accNickName }, // Body
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      console.log('資料更新成功 ', response.data);
      alert('資料更新成功 ' + response.data.response);
      return response.data;
   })
   .catch((error) => {
      alert('資料處理發生異常，請聯絡系統管理員' + error);
      // throw error;
   });
}
// 儲存帳號資料 API End //
