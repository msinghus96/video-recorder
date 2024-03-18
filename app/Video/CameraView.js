/* eslint-disable no-alert */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  getCameraFormat,
  useCameraDevice,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import ResolutionView from './ResolutionSelector';
import { useDebounce } from './util';

const CameraView = () => {
  const device = useCameraDevice('back');

  const [format, setFormat] = useState(
    getCameraFormat(device, [
      {
        videoResolution: {width: 480, height: 720},
      },
    ]),
  );
  const cameraRef = useRef();
  const [recording, setRecoding] = useState(false);
  const recordingInitilize = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (recording) {
      recordingInitilize.current = false;
    }
  }, [recording]);



  const startRecording = () => {
    if (recordingInitilize.current) {
      return;
    }

    recordingInitilize.current = true;
    setTimeout(() => {
      setRecoding(true);
    }, 200);
    cameraRef.current?.startRecording({
      onRecordingFinished: video => {
        const path = video.path;

        RNFS.stat(path)
          .then(resp => {
            const size = resp.size;
            alert(`The last video was ${(size / 1024 / 1024).toFixed(2)} MB`);
          })
          .catch(error => {
            alert('error: ' + error);
          });
        setRecoding(false);
        savingRef.current = false;
      },
      onRecordingError: error => {
        alert('error: ' + JSON.stringify(error));
        setRecoding(false);
        savingRef.current = false;
      },
    });
  };

  const stopRecording = () => {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    cameraRef.current?.stopRecording();
  };

  const debouncedStartRecording = useDebounce(startRecording);
  const debouncedStopRecording = useDebounce(stopRecording);

  if (device == null) {
    return (
      <View style={style.notFoundContainer}>
        <Text>Camera not found</Text>
      </View>
    );
  }

  const onResolutionSelect = item => {
    setFormat(
      getCameraFormat(device, [
        {
          videoResolution: {width: item.width, height: item.height},
        },
      ]),
    );
  };

  return (
    <React.Fragment>
      <Camera
        ref={cameraRef}
        video={true}
        audio={true}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        format={format}
      />
      <View style={style.controlsContainer}>
        <View style={style.innerContainer}>
          <ResolutionView
            disabled={recording}
            onResolutionSelect={onResolutionSelect}
          />

          <TouchableOpacity
            onPress={() => {
              if (recordingInitilize.current) {
                return;
              }
              if (recording) {
                debouncedStopRecording();
              } else {
                debouncedStartRecording();
              }
            }}>
            <Text style={style.text}>
              {recording ? 'Stop recoding' : 'Start recoding'}
            </Text>
          </TouchableOpacity>
        </View>
        {recording && (
          <View style={style.recodingIndicator}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </React.Fragment>
  );
};

const style = StyleSheet.create({
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  innerContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
  },
  recodingIndicator: {
    position: 'absolute',
    top: 50,
    right: 50,
  },
});

export default CameraView;
