export class Team {
  constructor(name, fighters) {
    this.name = name;
    this.fighters = fighters;
    this.id = this.name.replace(' ', '');
  }
}
