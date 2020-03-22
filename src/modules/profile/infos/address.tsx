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

export const ProfileInfosAddress = observer(() => {
  const navigation = useNavigation();
  const profileFlowStore = useProfileFlowStore();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ModalArrowClose />

      <View>
        <Text style={styles.title}>Please enter your address</Text>
      </View>

      <TextInput
        label="Address"
        value={profileFlowStore.address}
        onChangeText={address => (profileFlowStore.address = address)}
        autoCorrect={false}
        multiline={true}
      />

      <Button mode="contained" onPress={navigation.goBack}>
        Done
      </Button>
    </KeyboardAvoidingView>
  );
});
