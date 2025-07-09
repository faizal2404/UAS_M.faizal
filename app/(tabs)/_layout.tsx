import { Tabs } from 'expo-router';

export default function TabLayout() { 
  return (
    <Tabs>
      <Tabs.Screen name="welcome" options={{ title: 'welcome' }} />
      <Tabs.Screen name="home" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="explore" options={{ title: 'Eksplor' }} />
    </Tabs>
  );
}