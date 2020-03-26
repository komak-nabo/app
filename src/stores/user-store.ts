import { RootStore } from './root-store';
import { UsersApi } from '../api/user';
import { Storage } from '../utils/storage';
import { observable } from 'mobx';
import { User, LoginResult } from '../models/user';
import { Profile } from '../models/profile';

export class UserStore {
  public rootStore: RootStore;

  public accessToken: LoginResult['accessToken'];

  @observable
  public user: User;
  @observable
  public profiles: Profile[];

  private promises: any[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.init();
  }

  public async socialSignup(type: 'google' | 'apple') {
    let data;
    if (type === 'apple') {
      data = await this.rootStore.socialLoginStore.appleLogin();
      if (!data) {
        return false;
      }
    }
    if (type === 'google') {
      data = await this.rootStore.socialLoginStore.googleLogin();
      if (!data) {
        return false;
      }
    }
    this.user = data.user;
    await Storage.setJson('accessToken', {
      token: data.accessToken.token,
      expiration: data.accessToken.expiration,
    });

    await this.init();

    return true;
  }

  public async logout() {
    this.accessToken = null;
    this.user = null;
    this.profiles = [];
    await Storage.remove('accessToken');
    this.rootStore.profileFlowStore.reset();
  }

  public isLoggedIn() {
    return !!this.accessToken;
  }

  private async init() {
    this.accessToken = await Storage.getJson('accessToken');
    if (!this.accessToken) {
      return;
    }

    const profiles = await UsersApi.getProfiles(this.accessToken.token);
    this.profiles = profiles;
    this.promises.forEach(resolve => resolve());
    this.promises = [];
  }

  public async waitReady() {
    if (this.profiles) {
      return Promise.resolve();
    }
    return new Promise(resolve => this.promises.push(resolve));
  }
}
