export const getCurrentDateTime = () => {
  let now = new Date();

  let year = now.getFullYear();
  let month = ('0' + (now.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0, nên cần cộng thêm 1
  let day = ('0' + now.getDate()).slice(-2);
  let hours = ('0' + now.getHours()).slice(-2);
  let minutes = ('0' + now.getMinutes()).slice(-2);
  let seconds = ('0' + now.getSeconds()).slice(-2);

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}