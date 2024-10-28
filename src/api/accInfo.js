import axios from 'axios';
const APIUrl = 'https://61a43e92-0ba6-4a79-96ae-0dc94502861b.mock.pstmn.io/'

// 取得帳號資料 API Start //
export function askAccInfo() {
   return axios.get(
      APIUrl + 'responseAccInfo',
      {
         headers: {
            'Content-Type': 'application/json'
         }
      }
   )
   .then((response) => {
      const accName = response.data.data[0].accName;
      const acc_type = { 1: "管理者", 2: "一般使用者", 3: "諮詢專家"}[response.data.data[0].acc_type];
      const accFullName = response.data.data[0].accFullName;
      const accNickName = response.data.data[0].accNickName;
      const recent_range = { 1: "意圖前期", 2: "意圖期", 3: "準備期", 4: "行動期", 5: "維持期" }[response.data.data[0].recent_range];
      const target_weight = response.data.data[0].target_weight;
      const target_walk = response.data.data[0].target_walk;
      const target_jog = response.data.data[0].target_jog;

      return { accName, acc_type, accFullName, accNickName, recent_range, target_weight, target_walk, target_jog };
   })
   .catch((error) => {
      alert('資料處理發生異常，請聯絡系統管理員 ', error);
      throw error;
   });
}
// 取得帳號資料 API End //

// 儲存帳號資料 API Start //
export function changeAccNickname(accNickName) {
   return axios.post(
      APIUrl + 'changeAccNickname',
      { nickname: accNickName },
      {
         headers: {
            'Content-Type': 'application/json'
         }
      }
   )
   .then((response) => {
      console.log('暱稱更新成功:', response);
      return response;
   })
   .catch((error) => {
      alert('資料處理發生異常，請聯絡系統管理員 ', error);
      throw error;
   });
}
// 儲存帳號資料 API End //
