import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../shared/text';
import { useProfileFlowStore } from '../../stores';
import { Geolocation } from '../../utils/geolocation';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/button';
import { ApprovedIcon } from '../../shared/approved-icon';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBoxButton } from '../../shared/button/checkbox-button';
import { NavBar } from '../nav-bar/nav-bar';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingBottom: 22,
    paddingTop: 22,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  buttonContainer: {
    marginBottom: 10,
    marginTop: 10,
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text bold={true} style={styles.title}>
          Thank you for helping your local community.
        </Text>

        <Text style={styles.description}>
          We just need a few things to set you up.
        </Text>

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
            <Button
              size="big"
              onPress={() => navigation.navigate('profile-infos-address')}
            >
              {profileFlowStore.address && <ApprovedIcon />} Address
            </Button>
          </View>
        )}

        {profileFlowStore.isValid() && (
          <Button onPress={() => navigation.navigate('signup')}>GO</Button>
        )}
      </ScrollView>
      <NavBar onBack={() => navigation.goBack()} />
    </View>
  );
});
