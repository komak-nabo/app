import { observable } from 'mobx';
import { RootStore } from './root-store';

export class ProfileFlowStore {
  public rootStore: RootStore;

  @observable
  public firstName: string;

  @observable
  public lastName: string;

  @observable
  public phone: string;

  @observable
  public dialCode: string;

  @observable
  public coords: [number, number];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}
