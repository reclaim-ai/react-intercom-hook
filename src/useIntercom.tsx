import { useEffect, useState } from "react";
import getInstance, {
  Intercom,
  IntercomSettings,
  IntercomCommand,
  IntercomOptions,
} from "./Intercom";

export const useIntercom = (
  settings?: IntercomSettings
): ((command: IntercomCommand, options?: IntercomOptions) => void) => {
  const [intercom, setIntercom] = useState<Intercom>(getInstance(settings));

  useEffect(() => {
    if (!settings || settings === intercom.settings) return;

    const isChanged = (attr: string): boolean =>
      undefined !== intercom.settings[attr] &&
      settings[attr] !== intercom.settings[attr];

    if (!!intercom.appId && ["app_id", "user_id", "email"].some(isChanged)) {
      // app_id or user changed, restart session
      intercom.command("shutdown");
      if (settings.app_id) intercom.boot(settings);
    } else if (!!settings.app_id && settings.app_id === intercom.appId) {
      // update current session
      intercom.command("update", settings);
    } else {
      // reset intercom
      setIntercom(getInstance(settings));
    }
  }, [intercom, settings]);

  return intercom.command;
};

export default useIntercom;
