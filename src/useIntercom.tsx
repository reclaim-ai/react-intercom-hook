import { useEffect, useState } from 'react';
import Intercom, {Intercom as IntercomClass, IntercomSettings } from './index';

export const useIntercom = (settings?: IntercomSettings): IntercomClass => {
  const [intercom] = useState<IntercomClass>(Intercom(settings));
  
  useEffect(() => {
    if (!settings) return;

    if (!!intercom.settings && ['app_id', 'user_id', 'email'].some(attr => (undefined !== intercom.settings[attr]) && (settings[attr] !== intercom.settings[attr]))) {
      // app_id or user changed, start a new session
      intercom.command('shutdown');
      intercom.command('boot', settings);
    } else if (!!settings.app_id && !intercom.settings?.app_id) {
      // update settings
      intercom.boot(settings);
    }

  }, [intercom, settings]);

  return intercom;
}

export default useIntercom;
