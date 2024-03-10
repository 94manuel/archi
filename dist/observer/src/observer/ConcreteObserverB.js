"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteObserverB = void 0;
const ConcreteSubject_1 = require("./ConcreteSubject");
class ConcreteObserverB {
    update(subject) {
        if (subject instanceof ConcreteSubject_1.ConcreteSubject && (subject.state === 0 || subject.state >= 2)) {
            console.log('ConcreteObserverB: Reacted to the event');
        }
    }
}
exports.ConcreteObserverB = ConcreteObserverB;
