import { React, useState, useContext } from 'react';
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
import { UserContext } from '../App';
import { authAccount, getUser } from '../modules/api';

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
    marginTop: 20,
    marginBottom: 8
  },
  loginButton: {
    backgroundColor: '#2400FF',
    borderWidth: 0,
    borderRadius: 40,
    height: 52,
    width: 130,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  loginButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15
  },
  forgotButton: {
    height: 42,
    width: 200,
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

function Login({ route, navigation }) {

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setAuthUsername, setUserId } = useContext(UserContext);

  async function handleLogin() {
    const res = await authAccount(username, password);
    console.log(res);
    if (res == null) {
      Alert.alert(
        "Login Failed",
        "Unexpected error occurred.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else if (res.status === "error") {
      if (res.message === "Incorrect email or password") {
        try {
          const userData = await getUser(username);
          if (userData.user.trials >= 5) {
            Alert.alert(
              "Login Failed",
              "Too many incorrect login attempts, try tomorrow.",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          } else {
            Alert.alert(
              "Login Failed",
              res.message,
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          }
          await addTrials(userData.user.id);
        } catch {
          console.log("internal error");
        }
      } else {
        Alert.alert(
          "Login Failed",
          res.message,
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      }
    } else {
      setAuthUsername(username);
      setUserId(res.data.user.id);
      navigation.navigate('Tradebook');
    }
  }

  function handlePassReset() {
    navigation.navigate('Reset Password');
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
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 40, marginTop: 30 }}>Log in.</Text>
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
            <Text style={styles.field}>Password</Text>
            <TextInput 
                onChangeText={setPassword}
                value={password}
                placeholder="Enter your password"
                style={styles.input}
                secureTextEntry={true}
                autoCapitalize="none"
            />
            <Button buttonStyle={styles.loginButton} titleStyle={styles.loginButtonText} type="submit" title="Log in" onPress={() => handleLogin()} />
            <Button buttonStyle={styles.forgotButton} titleStyle={styles.forgotButtonText} type="submit" title="Forgot password?" onPress={() => handlePassReset()} />
        </View>
    );
  }
}

export default Login;