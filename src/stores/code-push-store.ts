import { RootStore } from './root-store';
import Config from 'react-native-config';
import { Platform } from 'react-native';

import codePush from 'react-native-code-push';
import { Storage } from '../utils/storage';

export class CodePushStore {
  public rootStore: RootStore;

  public static stagingDeploymentKey =
    Platform.OS === 'android'
      ? Config.AndroidCodePushDeploymentKeyStaging
      : Config.IOSCodePushDeploymentKeyStaging;

  public static productionDeploymentKey =
    Platform.OS === 'android'
      ? Config.AndroidCodePushDeploymentKeyProduction
      : Config.IOSCodePushDeploymentKeyProduction;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.init();
  }

  private async init() {
    this.sync();
    setInterval(() => {
      this.sync();
    }, 10 * 60 * 1000);

    this.rootStore.appStateStore.onResume(() => {
      this.sync();
    });
  }

  private async sync() {
    const isBeta = await Storage.get('beta');
    const deploymentKey = isBeta
      ? CodePushStore.stagingDeploymentKey
      : CodePushStore.productionDeploymentKey;

    codePush.sync({ deploymentKey });
  }
}
