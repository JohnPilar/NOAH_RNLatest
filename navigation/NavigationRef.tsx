import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from './NavigationTypes';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string | any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return null;
}

export function getCurrentParentName(parentName?: string) {
  if (navigationRef.isReady()) {
    if (parentName) {
      return navigationRef.getState().routes.find(ob => ob?.name == parentName)?.name;
    } else {
      return navigationRef.getState().routes.find((ob: any) => ob?.state?.routeNames.length > 0)?.name;
    }
  }
  return null;
}

export function getCurrentRouteParams() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.params;
  }
  return null;
}

//----- For Local Screens -----//

export function NmGetLocalScreenName(itemCode: string) {
  switch (itemCode) {
    case 'NOAH_CHAT':
      return 'MessageList';
    case 'ClockingHome':
      return 'ClockingHome';
  }
}
