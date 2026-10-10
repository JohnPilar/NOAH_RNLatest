import {TabsProvider, ReloadProvider} from '../../../functions/Contexts';
import V3_MenuItemNavigator from './V3_MenuItemNavigator';

export const MenuItemNavContext = props => (
  <TabsProvider>
    <ReloadProvider>
      <V3_MenuItemNavigator {...props} />
    </ReloadProvider>
  </TabsProvider>
);
