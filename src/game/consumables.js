import {Helpers} from "../utils/helpers";

export default class Consumable {

    static getPotions() {
        return [
            {
                health: 30,
                name: "Small healing potion"
            },
            {
                health: 40,
                name: "Medium healing potion"
            },
            {
                health: 50,
                name: "Large healing potion"
            }
        ];
    }

    static getFood() {
        return [
            {
                health: 10,
                name: "Sushi"
            },
            {
                health: 20,
                name: "Pizza"
            },
            {
                health: 30,
                name: "Cake"
            }
        ];
    }

    static getConsumable() {
        const rndNumber = Math.floor((Math.random() * 40) + 1);

        if(rndNumber > 20) {
            return Consumable.getPotions()[Helpers.getRandomNumber(0,2)];
        } else {
            return Consumable.getFood()[Helpers.getRandomNumber(0,2)];
        }
    }
}