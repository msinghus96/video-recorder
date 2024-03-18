import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {checkCameraPermission} from './util';
import CameraView from './CameraView';

const VideoRecorder = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const initilizePermissionCheck = async () => {
    const permission = await checkCameraPermission();
    if (permission) {
      setCameraPermission(true);
    }
  };

  const getCameraPermission = async () => {
    const permission = await checkCameraPermission(true);
    if (permission) {
      setCameraPermission(true);
    }
  };

  useEffect(() => {
    initilizePermissionCheck();
  }, []);

  return (
    <View style={styles.container}>
      {!cameraPermission && (
        <TouchableOpacity onPress={getCameraPermission}>
          <Text>Request camera permission</Text>
        </TouchableOpacity>
      )}
      {cameraPermission && <CameraView />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default VideoRecorder;
