import React, { memo } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';

import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../../shared/text';
import { TextInput } from '../../../shared/text-input';
import { useProfileFlowStore } from '../../../stores';
import { ModalArrowClose } from './modal-arrow-close';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export const ProfileInfosName = observer(() => {
  const navigation = useNavigation();
  const profileFlowStore = useProfileFlowStore();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ModalArrowClose />

      <View>
        <Text style={styles.title}>Please enter your first and last name</Text>
      </View>

      <TextInput
        label="First Name"
        value={profileFlowStore.firstName}
        onChangeText={firstName => (profileFlowStore.firstName = firstName)}
        autoCorrect={false}
      />

      <TextInput
        label="Last Name"
        value={profileFlowStore.lastName}
        onChangeText={lastName => (profileFlowStore.lastName = lastName)}
        autoCorrect={false}
      />

      <Button mode="contained" onPress={navigation.goBack}>
        Done
      </Button>
    </KeyboardAvoidingView>
  );
});
