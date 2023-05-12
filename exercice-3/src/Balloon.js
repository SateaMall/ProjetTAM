/**
 * @author Gurgun Dayioglu, Mariem El Gargouri, Mohamad Satea Almallouhi, Salma Ouadi
 */

const Balloon = class {
  static numberToColor(number) {
    // Convert the number to a string and pad it with a leading zero if it's only one digit
    const paddedNumber = number.toString().padStart(2, "0");

    // Use the padded number as the first component of the RGB color code
    const red = parseInt(paddedNumber[0] + paddedNumber[1], 16);

    // Use the padded number as the second component of the RGB color code
    const green = parseInt(paddedNumber[1] + paddedNumber[0], 16);

    // Use the sum of the two components as the third component of the RGB color code
    const blue = red + green;

    // Combine the RGB components into a CSS color string
    const color = `rgb(${red}, ${green}, ${blue})`;

    // Return the color
    return color;
  }

  constructor(x, y, r, c, cD) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.cD = cD;
  }
};

export default Balloon;
