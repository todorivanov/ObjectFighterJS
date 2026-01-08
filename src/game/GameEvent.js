import {Helpers} from "../utils/helpers";
import {Logger} from "../utils/logger";

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
            const msg = `<div><h5>${this.description}</h5></div>`;
            Logger.log(msg);
        }
    }

    static generateEvent() {
        const events = [
            new GameEvent({
                name: 'Earthquake',
                duration: 1,
                roundsLeft: 1,
                isGlobal: true,
                description: 'A giant earthquake that shakes the earth. -100HP for all fighters on the field.',
                effect: function (objs) {
                    for(const obj of objs) {
                        const msg = `${obj.name} loses 100HP because of the earthquake.`;
                        obj.health -= 100;
                        Logger.log(msg);
                    }
                }
            }),
            new GameEvent({
                name: 'Full moon',
                duration: 1,
                roundsLeft: 1,
                isGlobal: false,
                isTeamEvent: true,
                description: 'A full moon is in the sky. Wild animals attack the camp. All fighters from one of the teams lose half of their HP',
                effect: function (objs) {
                    for(const obj of objs) {
                        const lostHealth = Math.round(obj.health / 2);
                        obj.health -= lostHealth;
                        const msg = `${obj.name} loses ${lostHealth}HP because of the animal attack.`;
                        Logger.log(msg);
                    }
                }
            }),
            new GameEvent({
                name: 'Poisonous food',
                duration: 5,
                roundsLeft: 5,
                isGlobal: false,
                isTeamEvent: true,
                description: 'The food of the team has been poisoned. Each fighter will loose 20HP for every turn until the event ends',
                effect: function (objs) {
                    for(const obj of objs) {
                        const msg = `${obj.name} loses 20HP because of the food poisoning.`;
                        obj.health -= 20;
                        Logger.log(msg);
                    }
                }
            }),
            // new Event({
            //     name: '',
            //     duration: 5,
            //     description: ''
            // }),
            // new Event({
            //     name: '',
            //     duration: 5,
            //     description: ''
            // }),
            // new Event({
            //     name: '',
            //     duration: 5,
            //     description: ''
            // }),
        ];

        return events[Helpers.getRandomNumber(0, events.length - 1)];
    }
}