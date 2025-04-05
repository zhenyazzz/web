function showText(row) {
    document.getElementById("displayText").textContent = row.textContent;
    row.style.backgroundColor = document.getElementById("bgColor").value;
}
function hideText() {
    document.getElementById("displayText").textContent = "";
}
function applyStyles() {
    let textColor = document.getElementById("textColor").value;
    let fontSize = document.getElementById("fontSize").value;
    document.querySelectorAll("td, #displayText").forEach(el => {
        el.style.color = textColor;
        el.style.fontSize = fontSize;
    });
}