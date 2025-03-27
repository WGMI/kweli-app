import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="index" />
      {/* Add other screens here as needed */}
    </Stack>
  );
}
