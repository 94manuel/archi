import Singleton from './src/singleton';
        
        const instance1 = Singleton.getInstance();
        const instance2 = Singleton.getInstance();
        
        console.log(instance1 === instance2);  // Debería imprimir 'true'
        