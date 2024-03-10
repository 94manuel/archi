import path from 'path';
import fs from 'fs';

export class CreateObserverStructure implements IPatternsStrategy {
  doAlgorithm(pattern: string): void {
    console.log(`Creando estructura para el patrón ${pattern}...`);
    const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
    fs.mkdirSync(rootDir, { recursive: true });
    const srcDir = path.join(rootDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    const observerDir = path.join(srcDir, 'observer');
    fs.mkdirSync(observerDir, { recursive: true });

    const subject = `import { Observer } from "./Observer";

export interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}`;

    const concreteSubject = `import { Observer } from "./Observer";
    import { Subject } from "./Subject";
    
export class ConcreteSubject implements Subject {
    private observers: Observer[] = [];
    private _state: number;

    constructor() {
      this._state = 0;
    }

    // Método para obtener el estado
    public get state(): number {
     return this._state;
    }

    // Método para establecer el estado y notificar a los observadores
    public set state(value: number) {
      this._state = value;
      this.notify();
    }

    public attach(observer: Observer): void {
      const isExist = this.observers.includes(observer);
      if (isExist) return;
      this.observers.push(observer);
    }

    public detach(observer: Observer): void {
      const observerIndex = this.observers.indexOf(observer);
      if (observerIndex === -1) return;

      this.observers.splice(observerIndex, 1);
    }

    public notify(): void {
      for (const observer of this.observers) {
        observer.update(this);
      }
    }
  // ConcreteSubject-specific logic
}`;

    const observerInterface = `import { Subject } from "./Subject";

export interface Observer {
  update(subject: Subject): void;
}`;

    const concreteObserverA = `import { ConcreteSubject } from "./ConcreteSubject";
import { Observer } from "./Observer";
import { Subject } from "./Subject";
    
export class ConcreteObserverA implements Observer {
    public update(subject: Subject): void {
      if (subject instanceof ConcreteSubject && subject.state < 3) {
      console.log('ConcreteObserverA: Reacted to the event');
    }
  }
}`;

    const concreteObserverB = `import { ConcreteSubject } from "./ConcreteSubject";
import { Observer } from "./Observer";
import { Subject } from "./Subject";
    
export class ConcreteObserverB implements Observer {
    public update(subject: Subject): void {
    if (subject instanceof ConcreteSubject && (subject.state === 0 || subject.state >= 2)) {
    console.log('ConcreteObserverB: Reacted to the event');
    }
  }
}`;

    const observerIndexContent = `import { ConcreteObserverA } from "./src/observer/ConcreteObserverA";
import { ConcreteObserverB } from "./src/observer/ConcreteObserverB";
import { ConcreteSubject } from "./src/observer/ConcreteSubject";

      const subject = new ConcreteSubject();

      const observer1 = new ConcreteObserverA();
      subject.attach(observer1);

      const observer2 = new ConcreteObserverB();
      subject.attach(observer2);

      subject.state = 2;
      subject.state = 3;
      `;

    fs.writeFileSync(path.join(observerDir, 'Subject.ts'), subject);
    fs.writeFileSync(path.join(observerDir, 'ConcreteSubject.ts'), concreteSubject);
    fs.writeFileSync(path.join(observerDir, 'Observer.ts'), observerInterface);
    fs.writeFileSync(path.join(observerDir, 'ConcreteObserverA.ts'), concreteObserverA);
    fs.writeFileSync(path.join(observerDir, 'ConcreteObserverB.ts'), concreteObserverB);
    fs.writeFileSync(path.join(rootDir, 'index.ts'), observerIndexContent);
    console.log(`Observer pattern example created in ${rootDir}/index.ts`);
    console.log(`Observer pattern structure created in ${observerDir}`);
  }

}