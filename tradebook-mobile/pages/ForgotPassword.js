import { React, useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import blueLogo from '../assets/blue-logo.png';
import { getUser, verifySecurityQuestion, updatePassword } from '../modules/api';

const styles = StyleSheet.create({
  img: {
    height: 55,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
    height: 45,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#DEDEDE',
    width: '100%',
  },
  field: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    marginTop: 30,
    marginBottom: 8
  },
  loginButton: {
    backgroundColor: '#2400FF',
    borderWidth: 0,
    borderRadius: 40,
    height: 52,
    width: 130,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 8
  },
  loginButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15
  },
  forgotButton: {
    height: 42,
    width: 200,
    marginTop: 10,
    alignSelf: 'center'
  },
  forgotButtonText: {
    color: '#2400FF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ForgotPassword({ route, navigation }) {

  // const { email } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [userId, setUserId] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setPassword] = useState('');

  function handleLogin() {
    navigation.navigate('Login');
  }

  const passRegex = /^[a-z0-9]+$/i;

  async function checkUser() {
    setQuestion('');
    const res = await getUser(username);
    if (res == null) {
      Alert.alert(
        "Error",
        "An unexpected error occurred.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else if (res.status === "error") {
      Alert.alert(
        "No Tradebook Account",
        "There is no account associated with that email.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else {
      setQuestion(res.user.securityQuestion);
      setUserId(res.user.id);
    }
  }

  async function handleResetPassword() {
    const res = await verifySecurityQuestion(userId, answer);
    if (res == null || res.status === "error") {
      Alert.alert(
        "Error",
        "An unexpected error occurred.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else if (!res.data) {
      Alert.alert(
        "Attempt Failed",
        "Incorrect security question answer.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else if (!passRegex.exec(newPassword) || newPassword.length < 8) {
      Alert.alert(
        "Invalid New Password",
        "Please enter an alphanumeric password with 8+ characters.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else {
      const passRes = await updatePassword(answer, userId, newPassword);
      if (passRes == null || passRes.status !== "success") {
        Alert.alert(
          "Error",
          "An unexpected error occurred.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      } else {
        Alert.alert(
          "Success",
          "Successfully reset password!",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      }
    }
  }

  if (!fontsLoaded) {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" />
        </View>
    );
  } else {
    return (
        <View style={styles.container}>
            <Image source={blueLogo} style={styles.img}/>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 28, marginTop: 30 }}>Forgot password?</Text>
            <Text style={styles.field}>Email</Text>
            <TextInput 
                onChangeText={setUsername}
                value={username}
                placeholder="joe@email.com"
                style={styles.input}
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button buttonStyle={styles.loginButton} titleStyle={styles.loginButtonText} type="submit" title="Go" onPress={() => checkUser()} />
            <Text style={styles.field}>Security Question: {question}</Text>
            <TextInput 
                onChangeText={setAnswer}
                value={answer}
                placeholder="Enter your answer"
                style={styles.input}
                autoCapitalize="none"
            />
            <Text style={styles.field}>New Password</Text>
            <TextInput 
                onChangeText={setPassword}
                value={newPassword}
                placeholder="Enter your new password"
                style={styles.input}
                autoCapitalize="none"
                secureTextEntry={true}
            />
            <Button buttonStyle={styles.loginButton} titleStyle={styles.loginButtonText} type="submit" title="Reset" onPress={() => handleResetPassword()} />
            <Button buttonStyle={styles.forgotButton} titleStyle={styles.forgotButtonText} type="submit" title="Log in" onPress={() => handleLogin()} />
        </View>
    );
  }
}

export default ForgotPassword;