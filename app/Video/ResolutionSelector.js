import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

const ResolutionSupported = [
  {
    title: '480p',
    width: 480,
    height: 720,
  },
  {
    title: '720',
    width: 720,
    height: 1280,
  },
  {
    title: '960',
    width: 960,
    height: 1280,
  },
  {
    title: '1024',
    width: 1024,
    height: 1280,
  },
];

const ResolutionView = props => {
  const {onResolutionSelect, disabled} = props;

  const [selected, setSelected] = useState(ResolutionSupported[0]);

  const onSelect = item => {
    onResolutionSelect(item);
    setSelected(item);
  };

  return (
    <View style={style.container}>
      <Picker
        mode="dialog"
        enabled={!disabled}
        selectedValue={selected}
        style={style.text}
        onValueChange={onSelect}>
        {ResolutionSupported.map((item, index) => (
          <Picker.Item label={item.title} value={item} key={index} />
        ))}
      </Picker>
    </View>
  );
};

const style = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    width: 150,
  },
});

export default ResolutionView;
