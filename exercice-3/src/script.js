/**
 * @author Gurgun Dayioglu, Mariem El Gargouri, Mohamad Satea Almallouhi, Salma Ouadi
 */

import Balloon from "./Balloon.js";

const coordinateMultipliers = {
  x(x) {
    return x * 100;
  },
  y(y) {
    return y * 110;
  },
  r(r) {
    return r * 10;
  },
};
const canvas = document.querySelector("#canvas");
canvas.width = 2500;
canvas.height = 800;

const ctx = canvas.getContext("2d");
const data = await fetch("./data.json")
  .then((data) => data.json())
  .catch(() => []);
const balloons = data.map((b) => {
  const balloon = new Balloon(
    coordinateMultipliers.x(b.x),
    coordinateMultipliers.y(b.y),
    coordinateMultipliers.r(b.r),
    Balloon.numberToColor(b.c),
    b.c
  );

  balloon.initialY = canvas.height;

  return balloon;
});

const drawCanvas = function () {
  // Create the linear gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 2000);
  gradient.addColorStop(0, "white"); // start color
  gradient.addColorStop(1, "blue"); // end color

  // Fill the canvas with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2500, 1000);
  // Add a new gradient for the balloons colors

  const balloonGradient = ctx.createLinearGradient(50, 650, 2000, 650);
  const colors = balloons
    .map((balloon) => balloon.cD)
    .filter((c, i, array) => array.indexOf(c) === i)
    .sort((a, b) => a - b);

  colors.forEach((color, index) => {
    balloonGradient.addColorStop(
      index / colors.length,
      Balloon.numberToColor(color)
    );
    balloonGradient.addColorStop(
      (index + 1) / colors.length,
      Balloon.numberToColor(color)
    );
  });
  ctx.fillStyle = balloonGradient;
  ctx.fillRect(50, 650, 1950, 100);

  // Add a text for each balloon color
  ctx.fillStyle = "white";
  ctx.font = "10px Arial";
  colors.forEach((color, index) => {
    let textX = 50 + (index * 1950) / colors.length;
    let textY = 745;
    ctx.fillText(color, textX, textY);
  });

  // const gradientColor = ctx.createLinearGradient(50, 650, 2000, 650);
  // gradientColor.addColorStop(0, "rgb(255, 0, 0)"); // Red
  // gradientColor.addColorStop(0.17, "rgb(255, 255, 0)"); // Yellow
  // gradientColor.addColorStop(0.33, "rgb(0, 255, 0)"); // Green
  // gradientColor.addColorStop(0.5, "rgb(0, 255, 255)"); // Cyan
  // gradientColor.addColorStop(0.67, "rgb(0, 0, 255)"); // Blue
  // gradientColor.addColorStop(0.84, "rgb(255, 0, 255)"); // Magenta
  // gradientColor.addColorStop(1, "rgb(255, 0, 0)"); // Red
  // ctx.fillStyle = gradientColor;
  // ctx.fillRect(50, 750, 1950, 100);

  ctx.strokeStyle = "#brown";
  // Draw the X axis line
  ctx.beginPath();
  ctx.moveTo(25, 50);
  ctx.lineTo(2050, 50);
  ctx.stroke();

  // Draw the Y axis line
  ctx.beginPath();
  ctx.moveTo(25, 50);
  ctx.lineTo(25, 625);
  ctx.stroke();
};
const draw = function (balloon) {
  ctx.beginPath();
  ctx.arc(balloon.x, balloon.initialY, balloon.r, 0, Math.PI * 2);
  ctx.fillStyle = balloon.c;
  ctx.fill();
};
const drawValues = function (b) {
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  let textX = b.x - b.r;
  let textY = b.y - b.r;
  let attributs = ["x", "y", "taille", "couleur"];
  let valeurs = [b.x, b.y, b.r, b.c];
  for (let i = 0; i < attributs.length; i += 1) {
    ctx.fillText(`${attributs[i]}: ${valeurs[i]}`, textX, textY + 20 * i);
  }
};
const animate = function () {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the canvas
  drawCanvas();

  // Draw the balloons on the canvas
  balloons.forEach((balloon) => {
    draw(balloon);
  });

  // Update the positions of the balloons and check if the animation is finished
  let finished = true;

  balloons.forEach((balloon) => {
    if (balloon.initialY > balloon.y) {
      finished = false;
      if (balloon.initialY - balloon.y > 50) {
        balloon.initialY -= 5;
      } else if (balloon.initialY - balloon.y > 10) {
        balloon.initialY -= 4;
      } else if (balloon.initialY - balloon.y > 1) {
        balloon.initialY -= 2;
      } else {
        balloon.initialY -= 1;
      }
    }
  });

  // Request the next animation frame
  if (!finished) requestAnimationFrame(animate);
};

const blnf = document.querySelector("#balloonaddr");
blnf.addEventListener("submit", function (event) {
  event.preventDefault();

  const b = new Balloon(
    coordinateMultipliers.x(event.target.x.value),
    coordinateMultipliers.y(event.target.y.value),
    coordinateMultipliers.r(event.target.r.value),
    Balloon.numberToColor(event.target.c.value),
    coordinateMultipliers.y(event.target.c.value)
  );
  b.initialY = coordinateMultipliers.y(parseInt(event.target.y.value));

  balloons.push(b);

  drawCanvas();
  balloons.forEach((balloon) => {
    draw(balloon);
  });
});

// Start the animation loop
requestAnimationFrame(animate);

let hoveredBalloon = null;
canvas.addEventListener("mousemove", (e) => {
  const mousePos = {
    x: e.pageX - canvas.offsetLeft,
    y: e.pageY - canvas.offsetTop,
  };
  let balloonUnderMouse = null;

  balloons.forEach((balloon) => {
    const distance = Math.sqrt(
      (mousePos.x - balloon.x) ** 2 + (mousePos.y - balloon.y) ** 2
    );

    if (distance < balloon.r) {
      balloonUnderMouse = balloon;
    }
  });

  if (balloonUnderMouse !== hoveredBalloon) {
    hoveredBalloon = balloonUnderMouse;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    balloons.forEach((balloon) => {
      draw(balloon);
    });

    if (hoveredBalloon) {
      drawValues(hoveredBalloon);
    }
  }
});
