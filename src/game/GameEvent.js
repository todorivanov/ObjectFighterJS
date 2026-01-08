import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';

export default class GameEvent {
  constructor(eventObject) {
    this.name = eventObject.name;
    this.duration = eventObject.duration;
    this.description = eventObject.description;
    this.effect = eventObject.effect;
    this.roundsLeft = eventObject.roundsLeft;
    this.isTeamEvent = eventObject.isTeamEvent;
    this.isGlobal = eventObject.isGlobal;
    this.logEvent = function () {
      const msg = `
        <div class="event-announcement bg-warning bg-opacity-25 p-3 my-2 rounded text-center">
          <h5 class="mb-2">⚡ ${this.name.toUpperCase()} ⚡</h5>
          <p class="mb-0">${this.description}</p>
        </div>`;
      Logger.log(msg);
      soundManager.play('event');
    };
  }

  static generateEvent() {
    const events = [
      new GameEvent({
        name: '🌍 Earthquake',
        duration: 1,
        roundsLeft: 1,
        isGlobal: true,
        description:
          'The ground violently shakes beneath everyone! All fighters take 100 HP damage.',
        effect: function (objs) {
          for (const obj of objs) {
            const msg = `<div class="text-center text-danger">💥 <strong>${obj.name}</strong> takes 100 HP earthquake damage!</div>`;
            obj.health -= 100;
            Logger.log(msg);
          }
        },
      }),
      new GameEvent({
        name: '🌕 Full Moon',
        duration: 1,
        roundsLeft: 1,
        isGlobal: false,
        isTeamEvent: true,
        description:
          'Wild beasts emerge under the full moon, attacking one team! All fighters lose 50% HP.',
        effect: function (objs) {
          for (const obj of objs) {
            const lostHealth = Math.round(obj.health / 2);
            obj.health -= lostHealth;
            const msg = `<div class="text-center text-danger">🐺 <strong>${obj.name}</strong> is mauled by beasts! Lost ${lostHealth} HP!</div>`;
            Logger.log(msg);
          }
        },
      }),
      new GameEvent({
        name: '☠️ Poisoned Food',
        duration: 5,
        roundsLeft: 5,
        isGlobal: false,
        isTeamEvent: true,
        description:
          "One team's supplies are contaminated! They suffer 20 HP poison damage per round for 5 rounds.",
        effect: function (objs) {
          for (const obj of objs) {
            const msg = `<div class="text-center text-warning">🤢 <strong>${obj.name}</strong> is poisoned! Takes 20 HP damage.</div>`;
            obj.health -= 20;
            Logger.log(msg);
          }
        },
      }),
      new GameEvent({
        name: '⚡ Lightning Storm',
        duration: 2,
        roundsLeft: 2,
        isGlobal: true,
        description: 'Lightning strikes the battlefield! Everyone takes 50 HP damage for 2 rounds.',
        effect: function (objs) {
          for (const obj of objs) {
            const msg = `<div class="text-center text-primary">⚡ <strong>${obj.name}</strong> is struck by lightning! Takes 50 HP damage!</div>`;
            obj.health -= 50;
            Logger.log(msg);
          }
        },
      }),
      new GameEvent({
        name: '🔥 Fire Eruption',
        duration: 3,
        roundsLeft: 3,
        isGlobal: false,
        isTeamEvent: true,
        description: 'Flames engulf one team! They burn for 30 HP per round for 3 rounds.',
        effect: function (objs) {
          for (const obj of objs) {
            const msg = `<div class="text-center text-danger">🔥 <strong>${obj.name}</strong> is burning! Takes 30 HP fire damage!</div>`;
            obj.health -= 30;
            Logger.log(msg);
          }
        },
      }),
      new GameEvent({
        name: '❄️ Blizzard',
        duration: 4,
        roundsLeft: 4,
        isGlobal: true,
        description: 'A freezing blizzard hits everyone! All fighters take 15 HP for 4 rounds.',
        effect: function (objs) {
          for (const obj of objs) {
            const msg = `<div class="text-center text-info">❄️ <strong>${obj.name}</strong> is freezing! Takes 15 HP cold damage!</div>`;
            obj.health -= 15;
            Logger.log(msg);
          }
        },
      }),
    ];

    return events[Helpers.getRandomNumber(0, events.length - 1)];
  }
}
