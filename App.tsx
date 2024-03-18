import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import VideoRecorder from './app/Video';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <VideoRecorder />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
