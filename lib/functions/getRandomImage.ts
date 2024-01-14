export function getRandomImageName() {
  const minNum = 4611;
  const maxNum = 4613;
  const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  const imageName = `IMG_${randomNum}.png`; // Assuming the file format is .jpg
  return imageName;
}
