'use strict';

import { Chance } from 'chance';
const chance = new Chance();

export class ZooData {
    public static newAnimal() {
        const locations = [];
        for (let i = 0; i < 10; i++) {
            const location = {
                timestamp: chance.timestamp(),
                latitude: chance.timestamp(),
                longitude: chance.longitude()
            };
            locations.push(location);
        }

        return {
            id: chance.guid(),
            name: chance.animal(),
            locations
        };
    }

    public static animals() {
        const animals = [];
        for (let i = 0; i < 100; i++) {
            animals.push(ZooData.newAnimal());
        }

        return { animals };
    }
}
