"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteSubject = void 0;
class ConcreteSubject {
    constructor() {
        this.observers = [];
        this._state = 0;
    }
    // Método para obtener el estado
    get state() {
        return this._state;
    }
    // Método para establecer el estado y notificar a los observadores
    set state(value) {
        this._state = value;
        this.notify();
    }
    attach(observer) {
        const isExist = this.observers.includes(observer);
        if (isExist)
            return;
        this.observers.push(observer);
    }
    detach(observer) {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1)
            return;
        this.observers.splice(observerIndex, 1);
    }
    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}
exports.ConcreteSubject = ConcreteSubject;
