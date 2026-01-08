export class Helpers {
  static getRandomNumber(startInterval, endInterval) {
    startInterval = Math.ceil(startInterval);
    endInterval = Math.floor(endInterval);
    return Math.floor(Math.random() * (endInterval - startInterval + 1)) + startInterval; //The maximum is inclusive and the minimum is inclusive
  }
}
