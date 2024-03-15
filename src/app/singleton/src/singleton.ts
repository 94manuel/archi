class Singleton {
  private static instance: Singleton;

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }
}
class SingletonTorrrrr {
  private static instance: SingletonTorrrrr;

  private constructor() {}

  public static getInstance(): SingletonTorrrrr {
    if (!SingletonTorrrrr.instance) {
      SingletonTorrrrr.instance = new SingletonTorrrrr();
    }

    return SingletonTorrrrr.instance;
  }
}

export default {Singleton, SingletonTorrrrr};