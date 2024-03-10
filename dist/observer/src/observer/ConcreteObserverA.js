"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteObserverA = void 0;
const ConcreteSubject_1 = require("./ConcreteSubject");
class ConcreteObserverA {
    update(subject) {
        if (subject instanceof ConcreteSubject_1.ConcreteSubject && subject.state < 3) {
            console.log('ConcreteObserverA: Reacted to the event');
        }
    }
}
exports.ConcreteObserverA = ConcreteObserverA;
