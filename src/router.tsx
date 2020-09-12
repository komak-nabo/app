import React, { memo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileType } from '@modules/profile/type';
import { RouterAnimations } from './utils/router-animations';
import { Intro } from '@modules/intro/intro';
import { LoginSignup } from '@modules/auth/login-signup';
import { Authenticated } from '@modules/authenticated/authenticated';
import { Consents } from '@modules/consents/consents';
import { Theme } from '@shared/variables/theme';
import { colors } from '@shared/variables/colors';
import { ProfileInfosName } from '@modules/profile/infos/name';
import { ProfileInfosPhone } from '@modules/profile/infos/phone';
import { ProfileInfosAddress } from '@modules/profile/infos/address';
import { InfosMain } from '@modules/profile/infos-main';
import { AcceptedRequestView } from '@modules/authenticated/request/accepted';
import { SettingProfileStatus } from '@modules/authenticated/settings/setting-profile-status';
import { ProfileInfosGroup } from '@modules/profile/infos/group';
import { Onboarding } from '@modules/onboarding';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const modalOptions = {
  cardStyle: {
    backgroundColor: colors.grey100,
    borderTopLeftRadius: Theme.borderRadius,
    borderTopRightRadius: Theme.borderRadius,
  },
};

export const screenOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  cardOverlayEnabled: false,
};

export const RouterMain = memo(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        ...RouterAnimations.stackLeftRightFull,
      }}
    >
      <Stack.Screen name="intro" component={Intro} />
      <Stack.Screen name="login-signup" component={LoginSignup} />
      <Stack.Screen name="profile-type" component={ProfileType} />
      <Stack.Screen name="profile-infos" component={InfosMain} />
      <Stack.Screen name="consents" component={Consents} />
      <Stack.Screen name="onboarding" component={Onboarding} />
      <Stack.Screen name="authenticated" component={Authenticated} />
    </Stack.Navigator>
  );
});

export const Router = memo(() => {
  return (
    <RootStack.Navigator screenOptions={screenOptions} mode="modal">
      <RootStack.Screen name="Main" component={RouterMain} />
      <Stack.Screen
        name="profile-infos-name"
        component={ProfileInfosName}
        options={modalOptions}
      />
      <Stack.Screen
        name="profile-infos-phone"
        component={ProfileInfosPhone}
        options={modalOptions}
      />
      <Stack.Screen
        name="profile-infos-group"
        component={ProfileInfosGroup}
        options={modalOptions}
      />
      <Stack.Screen
        name="profile-infos-address"
        component={ProfileInfosAddress}
        options={modalOptions}
      />
      <Stack.Screen
        name="requests-request-accepted"
        component={AcceptedRequestView}
        options={modalOptions}
      />
      <Stack.Screen
        name="setting-profile-status"
        component={SettingProfileStatus}
        options={modalOptions}
      />
    </RootStack.Navigator>
  );
});
