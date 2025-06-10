import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BioDataScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');

  return (
    <View style={{ flex: 1 }}>
      {/* App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Bio Data" />
      </Appbar.Header>

      {/* Content Scrollable */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Bio */}
        <View style={styles.header}>
          <Image
            source={require('./assets/image.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Itunuoluwa Abidoye</Text>
          <Text style={styles.email}>itunuoluwa@petra.africa</Text>
        </View>

        {/* Form Inputs */}
        <TextInput
          label="What's your first name?"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="And your last name?"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          left={<TextInput.Icon icon={() => <Text style={{ fontSize: 18 }}>🇳🇬</Text>} />}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Date of Birth */}
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dob}>
          <Text>{dob.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) setDob(date);
            }}
          />
        )}

        {/* Additional Fields */}
        <TextInput
          label="Short description about yourself"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <TextInput
          label="Instagram"
          value={instagram}
          onChangeText={setInstagram}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Facebook"
          value={facebook}
          onChangeText={setFacebook}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Twitter"
          value={twitter}
          onChangeText={setTwitter}
          mode="outlined"
          style={styles.input}
        />

        {/* Update Button */}
        <Button mode="contained" style={styles.updateButton}>
          Update Profile
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    height: 50,
    paddingHorizontal: 8,
  },
  dob: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  updateButton: {
    backgroundColor: '#020066',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 16,
  },
});
