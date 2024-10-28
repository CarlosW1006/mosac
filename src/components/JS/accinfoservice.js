import { askAccInfo, changeAccNickname } from '@/api/accInfo';

// 呼叫取得帳號資料 API Start //
export function getAccInfo(accInfoArr) {
   return askAccInfo()
      .then((response) => {
         accInfoArr.value = response; // 更新 accInfoArr 的值
      })
}
// 呼叫取得帳號資料 API End //

// 呼叫編輯帳號資料 API Start //
export function sendAccNickname(accNickName) {
   return changeAccNickname(accNickName)
}
// 呼叫編輯帳號資料 API End //
