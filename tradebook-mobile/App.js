import { createContext, useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import  { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LogBox } from 'react-native';

import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Tradebooks from './pages/Tradebooks';
import TextbookDetails from './pages/TextbookDetails';
import Notifications from './pages/Notifications';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

const TradebookStack = createNativeStackNavigator();
const NotificationsStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const UserContext = createContext({
  username: "not-authenticated",
  setAuthUsername: (username) => {},
  userId: "no-userid",
  setUserId: (userId) => {}
});

function CoreTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'TradebookStack') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'NotificationsStack') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2400FF',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false
      })}
    >
      <Tab.Screen name="TradebookStack" component={TradebookStackScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="NotificationsStack" component={NotificationsStackScreen} options={{ headerShown: false }}/>
      {/* options={{ tabBarBadge: 3 }} */}
      <Tab.Screen name="Chats" component={ChatsStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function TradebookStackScreen() {
  return (
    <TradebookStack.Navigator >
      <TradebookStack.Screen name="Tradebooks" component={Tradebooks} />
      <TradebookStack.Screen name="Details" component={TextbookDetails} />
    </TradebookStack.Navigator>
  );
}

function NotificationsStackScreen() {
  return (
    <NotificationsStack.Navigator >
      <NotificationsStack.Screen name="Notifications" component={Notifications} />
      {/* <NotificationsStack.Screen name="Details" component={TextbookDetails} /> */}
    </NotificationsStack.Navigator>
  );
}

const ChatsStackScreen = ({ navigation }) => (
  <ChatsStack.Navigator>
    <ChatsStack.Screen name="Messages" component={Chats} />
    <ChatsStack.Screen
      name="Chat"
      component={Chat}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </ChatsStack.Navigator>
);


export default function App() {

  const [username, setAuthUsername] = useState("not-authenticated");
  const [userId, setUserId] = useState("no-userid");

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  return (
    <UserContext.Provider value={{ username, setAuthUsername, userId, setUserId }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" >
          <Stack.Screen name="Tradebook" component={CoreTabs} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Reset Password" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
