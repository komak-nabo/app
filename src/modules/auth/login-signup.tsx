import React, { memo } from 'react';

import { StyleSheet, View } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from '@shared/text';
import { useUserStore } from '@stores';
import { Touchable } from '@shared/button';
import { colors } from '@shared/variables/colors';
import { BottomNavbar } from '@modules/nav-bar';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  googleButton: {
    minWidth: 250,
    height: 60,
    margin: 10,
    borderRadius: 5,
    backgroundColor: colors.red400,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  googleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: ['lining-nums'],
    marginLeft: 5,
  },
  appleButton: {
    width: 250,
    height: 60,
    margin: 10,
  },
});

export const LoginSignup = memo(() => {
  const navigation = useNavigation();
  const userStore = useUserStore();
  const { t } = useTranslation();

  const socialSignup = (socialMedia: 'google' | 'apple') => async () => {
    const signupSuccess = await userStore.socialSignup(socialMedia);
    if (!signupSuccess) {
      return;
    }
    if (userStore.profiles.length) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'authenticated' }],
        })
      );
      return;
    }
    navigation.navigate('profile-type');
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.title} bold={true}>
          {t('SIGNIN_TITLE')}
        </Text>
        <Touchable
          onPress={socialSignup('google')}
          containerStyle={styles.googleButton}
          accessibilityRole="button"
        >
          <Icon name="google" size={20} color="white" />
          <Text style={styles.googleText}>{t('SIGNIN_GOOGLE')}</Text>
        </Touchable>
        {appleAuth.isSupported && (
          <AppleButton
            style={styles.appleButton}
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={socialSignup('apple')}
          />
        )}
      </View>
      <BottomNavbar onBack={navigation.goBack} />
    </View>
  );
});
