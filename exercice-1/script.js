/**
 * @author Gurgun Dayioglu, Mariem El Gargouri, Mohamad Satea Almallouhi, Salma Ouadi
 */

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = 850;
canvas.height = 600;

ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
ctx.fillRect(0, 0, 850, 600);

ctx.fillStyle = "grey";
ctx.fillRect(25, 30, 600, 70);

ctx.beginPath();
ctx.moveTo(175, 25);
ctx.lineTo(175, 200);
ctx.lineTo(12, 25);
// ctx.lineTo(180, 10); // voir la ligne prochaine
ctx.closePath(); // provoque le retour du stylo au point de départ du sous-traçé courant
ctx.fill(); // fillStyle est déjà === à gris

ctx.lineWidth = 10;
ctx.strokeStyle = "black";
ctx.stroke();

ctx.beginPath();
ctx.moveTo(250, 10);
ctx.lineTo(325, 120);
ctx.lineTo(175, 120);
ctx.closePath();
ctx.fill();

ctx.shadowColor = "black";
ctx.shadowBlur = 10;

const triangleGradient = ctx.createLinearGradient(250, 5, 250, 120);
triangleGradient.addColorStop(0, "black");
triangleGradient.addColorStop(1, "white");

ctx.lineWidth = 10;
ctx.strokeStyle = triangleGradient;
ctx.stroke();

const textGradient = ctx.createLinearGradient(200, 200, 300, 300);
textGradient.addColorStop(0, "pink");
textGradient.addColorStop(0.33, "purple");
textGradient.addColorStop(0.66, "blue");
textGradient.addColorStop(1, "red");
ctx.fillStyle = textGradient;

ctx.shadowBlur = 5;
ctx.font = "48px arial";
ctx.fillText("Hello world", 200, 200);

const img = document.createElement("img");
img.src = "https://placebear.com/500/300";
img.onload = function () {
  ctx.drawImage(img, 225, 225);
};

ctx.beginPath();
ctx.moveTo(15, 220);
ctx.lineTo(15, 550);
ctx.lineTo(200, 550);

ctx.shadowBlur = 0;
ctx.lineWidth = 1;
ctx.strokeStyle = "orange";
ctx.stroke();
