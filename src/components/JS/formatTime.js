export function formatTime(isoString) {
   const date = new Date(isoString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，需要 +1
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function formatDate(isoString) {
   const date = new Date(isoString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，需要 +1
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
}