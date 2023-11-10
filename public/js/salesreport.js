function getFormattedDate(){
  const today = new Date()
  const year = today.getFullYear()
  let mouth = today.getMonth()+1
  let day = today.getDate()

  if(mouth< 10){
    mouth = '0' + day
  }
  if (day < 10) {
    day = '0' + day;
}
 return `${year}-${mouth}-${day}` ;
}
function handleSalesReport(){
  const todayDate = getFormattedDate();
  console.log(todayDate);


  window.location.href = `salesreport?Date=${todayDate}`;
  
 



 }