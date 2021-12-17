const url = "https://hexschool.github.io/js-filter-data/data.json";
const showLists = document.querySelector(".showList");
const btns = document.querySelector(".button-group");
const searchName = document.querySelector(".seach-group");
const cropInputs = document.querySelector("#crop");
const sortSelects = document.querySelector(".sort-select");
const moblieSelects = document.querySelector("#js-moblie-select");
const sortAdvanceds = document.querySelector(".js-sort-advanced");
//console.log(sortAdvanceds);
let data = [];
let matchData = [];

function getData(){
  axios.get(url)
       .then(function (res) {
        //console.log(response.data);
        //data = res.data;
        data = res.data.filter((item)=>item.作物名稱);
        //matchData = data;  //對 matchData 進行排序會影響到 data 的排序
        matchData = [...data];
        renderData(data);
    });
}
getData();

//渲染功能
function renderData(showData){
  let str = "";
  showData.forEach((item)=>{
    //console.log(item.作物名稱);
    //<td colspan="6" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td>
    str +=`<tr>
             <td>${item.作物名稱}</td>
             <td>${item.市場名稱}</td>
             <td>${item.上價}</td>
             <td>${item.中價}</td>
             <td>${item.下價}</td>
             <td>${item.平均價}</td>
             <td>${item.交易量}</td>
           </tr>`;
  })
  showLists.innerHTML = str;
}

//按鈕篩選功能
btns.addEventListener("click", (e)=>{
  //console.log(e.target.dataset.type);
  let filterData = [];
  if(e.target.nodeName === "BUTTON"){
    const selectBtns = document.querySelectorAll(".button-group button");
    selectBtns.forEach((item)=> item.classList.remove("active"));
    if(e.target.dataset.type === "N03"){
      e.target.classList.add("active");
      filterData = data;
    }
    if(e.target.dataset.type === "N04"){
      e.target.classList.add("active");
      filterData = data.filter((item)=> item.種類代碼 === "N04");
    }
    else if(e.target.dataset.type === "N05"){
      e.target.classList.add("active");
      filterData = data.filter((item)=> item.種類代碼 === "N05");
    }
    else if(e.target.dataset.type === "N06"){
      e.target.classList.add("active");
      filterData = data.filter((item)=> item.種類代碼 === "N06");
    }
    renderData(filterData);
  }
})

//作物收尋功能
searchName.addEventListener("click", searchData);
function searchData(e){
  //console.log(e.target.nodeName);
  let inputValues = cropInputs.value.trim();
  let searchData = [];
  if(e.target.nodeName === "BUTTON"){
    if(!inputValues){
      alert("阿呆!請輸入內容再送出!!");
      return;
    }
    //searchData = data.filter((item)=> item.作物名稱 === cropInputs.value);
    searchData = matchData.filter((item)=>{
      if(item.作物名稱 == "null"){  //判斷作物為null時就終止
        return;
      }else{
      return item.作物名稱.match(inputValues);
      }
    })
    
    if(searchData.length === 0){
      showLists.innerHTML = `<tr><td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td></tr>`;
    }else{
    cropInputs.value = "";  //篩選成功將輸入欄位變空
    renderData(searchData);
    }
  }
}

//篩選功能
sortSelects.addEventListener("change", switchSelect);
moblieSelects.addEventListener("change", switchSelect);
function switchSelect(e){
  switch(e.target.value){
    case "依上價排序":
      selectChange("上價");
      break;
    case "依中價排序":
      selectChange("中價");
      break;
    case "依下價排序":
      selectChange("下價");
      break;
    case "依平均價排序":
      selectChange("平均價");
      break;
    case "依交易量排序":
      selectChange("交易量");
      break;
    default:
      break;
  }
}
 function selectChange(value){
   matchData.sort((a, b)=>{
     return b[value] - a[value]; //從大排到小
   })
   renderData(matchData);
}

//點擊up, down篩選功能
sortAdvanceds.addEventListener("click", (e)=>{
  //console.log(e.target.dataset.sort);
  if(e.target.nodeName === "I"){
    let sortPrice = e.target.dataset.price;
    let sortUpDown = e.target.dataset.sort;
    //console.log(sortUpDown);
    if(sortUpDown === "up"){  //判斷如果點選up, 從大排到小
      data.sort((a, b)=>{
        return b[sortPrice] - a[sortPrice];
      })
    }else{  //判斷如果點選down, 從大排到小
      data.sort((a, b)=>{
        return a[sortPrice] - b[sortPrice];
      })
    }
    renderData(data);
  }
})