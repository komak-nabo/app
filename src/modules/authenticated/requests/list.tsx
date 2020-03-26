import React from 'react';;

import { StyleSheet, View } from 'react-native';
import { TabContainer } from '../common/tab-container';
import { Button } from '../../../shared/button';
import { useNavigation } from '@react-navigation/native';
import { EmptyBox } from '../common/empty-box';
import { ShareButton } from '../../../shared/button/share-button';
import { useUserStore, useRequestsStore } from '../../../stores';
import { observer } from 'mobx-react-lite';
import {Request, RequestListItem} from './request-list-item'

const styles = StyleSheet.create({
  button: {
    marginVertical: 40,
  },
});

export const RequestsList = observer(() => {
  const navigation = useNavigation();
  const { profile } = useUserStore();
  const requestsStore = useRequestsStore();

  const requestHelp = async () => {
    await requestsStore.createRequest();

  };

  const hasRequests = !!requestsStore.requests?.length;

  return (
    <TabContainer title="Requests">
      
      <View style={{flex: 1,  width: '100%'}}>
        {!hasRequests && <EmptyBox title="The more healthy helpers the better. Add your friends and help out." />}
        {hasRequests && requestsStore.requests?.map(request => (<RequestListItem request={request} />))}
      </View>

      {profile?.role === 'helper' && (
        <ShareButton style={styles.button} url="https://komak.io" />
      )}
      {profile?.role === 'needer' && !hasRequests && (
        <Button size="big" style={styles.button} onPress={requestHelp}>
          Request help
        </Button>
      )}
    </TabContainer>
  );
});
