function submitSurvey(event) {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let hotel = document.getElementById("hotel").checked ? "Да" : "Нет";
  let transfer = document.getElementById("transfer").checked ? "Да" : "Нет";
  let guide = document.getElementById("guide").checked ? "Да" : "Нет";
  let color = document.getElementById("color").value;
  let guests = document.getElementById("guests").value;
  let rating = document.querySelector('input[name="rating"]:checked');
  let ratingValue = rating ? rating.value : "Не выбрано";

  if (!name || !phone) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }
  
  let previousUsers = JSON.parse(localStorage.getItem("previousUsers")) || [];

  if (!previousUsers.includes(name)) {
    previousUsers.push(
      { 
        name: name,  
      }
    );
    localStorage.setItem("previousUsers", JSON.stringify(previousUsers)); 
  }

  let surveyData = {
    name,
    phone,
    hotel,
    transfer,
    guide,
    color,
    guests,
    ratingValue,
  };

  localStorage.setItem("surveyData", JSON.stringify(surveyData));
  

  let resultPage = window.open("results.html", "_blank");
  if (!resultPage) {
    alert("Разрешите всплывающие окна, чтобы увидеть результаты.");
  }
}