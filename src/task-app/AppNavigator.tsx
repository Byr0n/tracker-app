import React from 'react';
import { TaskProvider } from './store/TaskContext';
import { NavigationProvider, useNavigation } from './navigation/NavigationContext';
import { HomeScreen } from './screens/HomeScreen';
import { EpicDetailScreen } from './screens/EpicDetailScreen';
import { CreateEpicScreen } from './screens/CreateEpicScreen';
import { CreateQuickHitScreen } from './screens/CreateQuickHitScreen';

function Navigator() {
  const { state } = useNavigation();

  switch (state.screen) {
    case 'EpicDetail':
      return <EpicDetailScreen epicId={state.params?.epicId ?? ''} />;
    case 'CreateEpic':
      return <CreateEpicScreen />;
    case 'CreateQuickHit':
      return <CreateQuickHitScreen />;
    default:
      return <HomeScreen />;
  }
}

export function AppNavigator() {
  return (
    <TaskProvider>
      <NavigationProvider>
        <Navigator />
      </NavigationProvider>
    </TaskProvider>
  );
}
