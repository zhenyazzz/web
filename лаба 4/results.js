document.addEventListener("DOMContentLoaded", function () {
  let surveyData = JSON.parse(localStorage.getItem("surveyData"));
  const previousUsers = JSON.parse(localStorage.getItem("previousUsers")) || [];
  console.log(previousUsers);
  

  if (!surveyData) {
    document.body.innerHTML = "<h2>Нет данных для отображения.</h2>";
    return;
  }

  let resultsTable = document.getElementById("resultsTable");
  let fields = {
    Имя: surveyData.name,
    Телефон: surveyData.phone,
    Гостиница: surveyData.hotel,
    Трансфер: surveyData.transfer,
    Гид: surveyData.guide,
    "Любимый цвет": `<span style="color:${surveyData.color}">${surveyData.color}</span>`,
    "Количество гостей": surveyData.guests,
    "Оценка услуг": surveyData.ratingValue,
  };

  for (let key in fields) {
    let row = resultsTable.insertRow();
    row.insertCell(0).textContent = key;
    row.insertCell(1).innerHTML = fields[key];
  }

  const previousUsersList1 = document.getElementById("previousUsersList1");
  
  previousUsers.forEach(user => {
    const option = document.createElement('option');
    option.value = user; 
    previousUsersList1.appendChild(option); 
  });

  
});
