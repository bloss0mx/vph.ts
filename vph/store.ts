import { DataUnit, Arrayy, Objecty } from './DataUnit';

class StoreKeeper {
  private store: DataUnit | Objecty | Arrayy;
  private forStore: object;
  private props: object;
  constructor(_store: DataUnit | Objecty | Arrayy, _forStore?: object, _props?: object) {
    this.store = _store;
    this.forStore = _forStore || {};
    this.props = _props || {};
  }

  register(name: string, pt, callback?: Function) {
    let found = this.findBaseData(name);
    if (found !== undefined) {
      found.addPush(pt);
      callback && callback.apply(pt);
    }
  }
  unregister(name: string, pt, callback?: Function) {
    let found = this.findBaseData(name);
    if (found !== undefined) {
      found.rmPush && found.rmPush(pt);
      callback && callback();
    }
  }

  setStore(data) {
    this.store = data;
  }
  setProps(callback) {
    console.error('setProps');
    this.props = callback(this.store, this.forStore, this.props);
  }
  // 只在for指令工作时使用
  setForStore(callback) {
    this.forStore = callback(this.store, this.forStore, this.props);
  }
  outputStore(): DataUnit | Objecty | Arrayy {
    return this.store;
  }
  outputForStore() {
    console.error('outputForStore');
    return this.forStore;
  }
  outputProps() {
    console.error('outputProps');
    return this.props;
  }
  outputAll(): [DataUnit, object, object] {
    return [
      this.store,
      this.forStore,
      this.props,
    ]
  }
  getValues(...params): object {
    if (this.store instanceof Objecty) {
      return this.store.getValues(...params);
    }
  }
  findBaseData(baseDataName) {
    let found;
    if (this.forStore[baseDataName] !== undefined) {
      found = this.forStore[baseDataName];
    } else if (this.props[baseDataName] !== undefined) {
      found = this.props[baseDataName];
    } else {
      found = this.store.showData(baseDataName);
    }
    return found;
  }
  rmSelf() { }
}

export default StoreKeeper;