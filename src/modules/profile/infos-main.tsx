import React, { useState } from 'react';
import { StyleSheet, View, Alert, Linking } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Text } from '../../shared/text';
import { useProfileFlowStore } from '../../stores';
import { Geolocation } from '../../utils/geolocation';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBoxButton } from '../../shared/button/checkbox-button';
import { BottomNavbar } from '../nav-bar/nav-bar';
import { colors } from '../../shared/variables/colors';
import { Touchable } from '../../shared/button';
import { CheckboxLink } from '../../shared/checkbox-link';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    marginTop: 16,
  },
  description: {
    fontSize: 20,
    marginBottom: 22,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  termsServiceText: {
    color: colors.green300,
    textAlign: 'right',
    marginBottom: 20,
  },
  termServiceLink: {
    textDecorationLine: 'none',
  },
});

export const InfosMain = observer(() => {
  const navigation = useNavigation();
  const profileFlowStore = useProfileFlowStore();
  const { t } = useTranslation();
  const [serviceTerms, setServiceTerms] = useState<boolean>(false);
  const [policyTerms, setPolicyTerms] = useState<boolean>(false);

  const getGeolocation = async () => {
    try {
      const infos = await Geolocation.get();
      profileFlowStore.coords = [infos.coords.longitude, infos.coords.latitude];
    } catch (error) {
      Alert.alert('Location', t(error));
    }
  };

  const goToNext = async () => {
    if (profileFlowStore.role === 'helper') {
      navigation.navigate('consents');
      return;
    }

    const res = await profileFlowStore.saveProfile();
    if (!res) {
      Alert.alert('Error saving profile');
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'authenticated' }],
      })
    );
  };

  const onServiceTerms = () => {
    Linking.openURL('https://komak.io/terms-of-service/');
    setServiceTerms(true);
    profileFlowStore.serviceTerms = serviceTerms;
  };

  const onPolicyTerms = () => {
    setPolicyTerms(!policyTerms);
    profileFlowStore.policyTerms = policyTerms;
  };

  return (
    <View style={styles.parentContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {profileFlowStore.role === 'helper' && (
          <View>
            <Text bold={true} style={styles.title}>
              {t('PROFILE_SETUP_HELPER_TITLE')}
            </Text>

            <Text style={styles.description}>{t('PROFILE_SETUP_TITLE')}</Text>
          </View>
        )}
        {profileFlowStore.role === 'needer' && (
          <View>
            <Text bold={true} style={styles.title}>
              {t('PROFILE_SETUP_TITLE')}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={() => navigation.navigate('profile-infos-name')}
            checked={
              !!(profileFlowStore.firstName && profileFlowStore.lastName)
            }
          >
            {t('PROFILE_SETUP_NAME')}
          </CheckBoxButton>
        </View>

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={getGeolocation}
            checked={!!profileFlowStore.coords}
          >
            {t('PROFILE_SETUP_GEOLOCATION')}
          </CheckBoxButton>
        </View>

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={() => navigation.navigate('profile-infos-phone')}
            checked={!!(profileFlowStore.phone && profileFlowStore.dialCode)}
          >
            {t('PROFILE_SETUP_PHONE')}
          </CheckBoxButton>
        </View>

        {profileFlowStore.role === 'needer' && (
          <View style={styles.buttonContainer}>
            <CheckBoxButton
              onPress={() => navigation.navigate('profile-infos-address')}
              checked={!!profileFlowStore.address}
            >
              {t('PROFILE_SETUP_ADDRESS')}
            </CheckBoxButton>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CheckboxLink onPress={onServiceTerms} checked={serviceTerms}>
            {t('PROFILE_SETUP_TERMS_CONFIRM')}
          </CheckboxLink>
          <CheckboxLink
            onPress={onPolicyTerms}
            checked={policyTerms}
            linkStyle={styles.termServiceLink}
          >
            {t('PROFILE_SETUP_POlICY_READ')}
          </CheckboxLink>
        </View>
      </ScrollView>
      <BottomNavbar
        onBack={navigation.canGoBack() && navigation.goBack}
        onNext={profileFlowStore.isValid() && goToNext}
      />
    </View>
  );
});
