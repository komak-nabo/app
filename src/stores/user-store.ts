import { RootStore } from './root-store';
import { Storage } from '../utils/storage';
import { observable, computed } from 'mobx';
import { User, LoginResult } from '../models/user';
import { Profile } from '../models/profile';
import { ProfilesApi } from '../api/profile';
import { UsersApi } from '../api/user';

export class UserStore {
  @observable
  public accessToken: LoginResult['accessToken'];

  @observable
  public user: User;
  @observable
  public profiles: Profile[];

  @computed
  public get profile() {
    return this.profiles?.length && this.profiles[0];
  }

  private promises: any[] = [];

  constructor(private rootStore: RootStore) {
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
    this.accessToken = data.accessToken;
    await Storage.setJson('accessToken', this.accessToken);

    await this.init();

    return true;
  }

  public async logout() {
    UsersApi.deleteRegistrationToken(
      this.accessToken?.token,
      this.rootStore.notificationsStore.registrationToken
    );
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

    if (this.user) {
      this.profiles = await ProfilesApi.getProfiles(this.accessToken.token);
    } else {
      const result = await Promise.all([
        UsersApi.getCurrent(this.accessToken.token),
        ProfilesApi.getProfiles(this.accessToken.token),
      ]);
      this.user = result[0];
      this.profiles = result[1];
    }

    this.promises.forEach((resolve) => resolve());
    this.promises = [];
  }

  public async patchProfile(
    profileId: string,
    profilePatchData: Partial<Profile>
  ) {
    this.accessToken = await Storage.getJson('accessToken');
    if (!this.accessToken) {
      return;
    }

    await ProfilesApi.patchProfile(
      this.accessToken.token,
      profileId,
      profilePatchData
    );
    this.profiles[0] = { ...this.profile, ...profilePatchData };
  }

  public async waitReady() {
    if (this.profiles) {
      return Promise.resolve();
    }
    return new Promise((resolve) => this.promises.push(resolve));
  }
}
