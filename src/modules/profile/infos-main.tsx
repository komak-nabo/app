import React from 'react';
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
});

export const InfosMain = observer(() => {
  const navigation = useNavigation();
  const profileFlowStore = useProfileFlowStore();
  const { t } = useTranslation();

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

  return (
    <View style={styles.parentContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {profileFlowStore.role === 'helper' && (
          <View>
            <Text bold={true} style={styles.title}>
              Thank you for helping your local community.
            </Text>

            <Text style={styles.description}>
              We just need a few things to set you up.
            </Text>
          </View>
        )}
        {profileFlowStore.role === 'needer' && (
          <View>
            <Text bold={true} style={styles.title}>
              We just need a few things to set you up.
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
            Your name
          </CheckBoxButton>
        </View>

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={getGeolocation}
            checked={!!profileFlowStore.coords}
          >
            Enable geolocation
          </CheckBoxButton>
        </View>

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={() => navigation.navigate('profile-infos-phone')}
            checked={!!(profileFlowStore.phone && profileFlowStore.dialCode)}
          >
            Phone
          </CheckBoxButton>
        </View>

        {profileFlowStore.role === 'needer' && (
          <View style={styles.buttonContainer}>
            <CheckBoxButton
              onPress={() => navigation.navigate('profile-infos-address')}
              checked={!!profileFlowStore.address}
            >
              Address
            </CheckBoxButton>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CheckBoxButton
            onPress={() => (profileFlowStore.terms = !profileFlowStore.terms)}
            checked={profileFlowStore.terms}
          >
            I have read and agree with the terms of service
          </CheckBoxButton>
        </View>
        <Touchable
          onPress={() => Linking.openURL('https://komak.io/terms-of-service/')}
          textStyle={styles.termsServiceText}
        >
          Read terms of service
        </Touchable>
      </ScrollView>
      <BottomNavbar
        onBack={navigation.canGoBack() && navigation.goBack}
        onNext={profileFlowStore.isValid() && goToNext}
      />
    </View>
  );
});
