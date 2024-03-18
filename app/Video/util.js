import {useEffect, useRef, useState} from 'react';
import {Linking} from 'react-native';
import {Camera} from 'react-native-vision-camera';

export const useDebounce = (callback, delay = 500) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

export const checkCameraPermission = async forcePermission => {
  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  if (
    forcePermission &&
    (cameraPermission === 'denied' || microphonePermission === 'denied')
  ) {
    Linking.openSettings();
    return;
  }

  const resolver = [];

  if (cameraPermission !== 'granted') {
    const cameraPermissionPromise = await Camera.requestCameraPermission()
      .then(granted => {
        console.log('');
        if (granted === 'granted') {
          console.log('done ----');
          return 1;
        } else {
          return 0;
        }
      })
      .catch(error => {
        return 0;
      });

    resolver.push(cameraPermissionPromise);
  }

  if (microphonePermission !== 'granted') {
    const microphonePermissionPromise =
      await Camera.requestMicrophonePermission()
        .then(granted => {
          if (granted === 'granted') {
            return 1;
          } else {
            return 0;
          }
        })
        .catch(error => {
          return 0;
        });

    resolver.push(microphonePermissionPromise);
  }

  const granted = resolver.every(item => item === 1);

  console.log('granted-- ', granted, resolver.length);

  if (granted === false && forcePermission) {
    alert('failed to get permission');
  }

  return granted;
};
