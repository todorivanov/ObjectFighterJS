import {Fighter} from "../entities/fighter";

export function getFighters() {
   return new Promise((resolve) => {
       setTimeout(() => {
           const fighters =  [
               new Fighter({
                   id: 1,
                   name: 'Gosho',
                   health: 1000,
                   strength: 10,
                   image: 'https://r50gh2ss1ic2mww8s3uvjvq1-wpengine.netdna-ssl.com/wp-content/themes/bealearninghero.org/assets/images/dest/home-hero-mosaic.png',
                   description: 'Well balanced fighter.'
               }),
               new Fighter({
                   id: 2,
                   name: 'Ivan',
                   health: 800,
                   strength: 20,
                   image: 'https://r50gh2ss1ic2mww8s3uvjvq1-wpengine.netdna-ssl.com/wp-content/themes/bealearninghero.org/assets/images/dest/hero-image-row.png',
                   description: 'A fighter with stronger attack, but less health points.'
               }),
               new Fighter({
                   id: 3,
                   name: 'Petar',
                   health: 900,
                   strength: 11,
                   image: 'http://www.flightattendantjoe.com/wp-content/uploads/2013/07/hero.jpg',
                   description: 'A little more power exchanged for some health'
               }),
               new Fighter({
                   id: 4,
                   name: 'Jivko',
                   health: 2000,
                   strength: 4,
                   image: 'http://nwpltd.org/wp-content/uploads/2015/12/hero.jpg',
                   description: 'Great for defending as this hero has a lot of health points but its very weak'
               }),
               new Fighter({
                   id: 5,
                   name: 'Bobba',
                   health: 1500,
                   strength: 6,
                   image: 'https://www.socialmediaexaminer.com/wp-content/uploads/2016/08/ms-hero.jpg',
                   description: 'More stronger unit in terms of health but with a weaker attack.'
               })
           ];

           resolve(fighters);
       }, 1000) // simulate API call
   });
}