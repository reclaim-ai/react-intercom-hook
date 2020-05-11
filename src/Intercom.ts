/* eslint-disable @typescript-eslint/camelcase */

declare global {
  interface Window {
    Intercom: (command: IntercomCommand, options?: IntercomOptions) => void;
    intercomSettings: IntercomSettings;
    attachEvent?: (event: string, callback: Function) => void;
  }
}

export enum IntercomAlignment {
  Left = "left",
  Right = "right",
}

export type IntercomAvatar = {
  type: string;
  image_url: string;
};

export type IntercomCompany = {
  company_id: string;
  name?: string;
  created_at?: string;
  plan?: string;
  monthy_spend?: number;
  user_count?: number;
  size?: number;
  website?: string;
  industry?: string;
};

export type IntercomMessengerAttributes = {
  app_id: string;
  custom_launcher_selector?: string;
  alignment?: IntercomAlignment;
  vertical_padding?: number;
  horizontal_padding?: number;
  hide_default_launcher?: boolean;
  session_duration?: number;
  action_color?: string;
  background_color?: string;
};

export type IntercomDataAttributes = {
  email?: string;
  user_id?: string;
  created_at?: string;
  name?: string;
  phone?: string;
  readonly last_request_at?: number; // reserved, can't be updated
  unsubscribed_from_emails?: boolean;
  language_override?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_term?: string;
  avatar?: IntercomAvatar;
  user_hash?: string;
  company?: IntercomCompany;
  companies?: IntercomCompany[];
} & { [custom_user_attribute: string]: string | number | boolean | null };

export type IntercomSettings = IntercomMessengerAttributes &
  IntercomDataAttributes;

export type IntercomCommand =
  | "boot"
  | "shutdown"
  | "hide"
  | "update"
  | "show"
  | "showNewMessage"
  | "showMessages"
  | "onHide"
  | "onShow"
  | "onUnreadCountChange"
  | "trackEvent"
  | "getVisitorId"
  | "startTour"
  | "reattach_activator";

export type IntercomOptions = unknown;

function injectIntercomScript(app_id: string): void {
  const w = window;
  const ic = w.Intercom;
  const is = w.intercomSettings;

  if (typeof ic === "function") {
    ic("reattach_activator");
    if (app_id === is.app_id) ic("update", is);
    else {
      ic("shutdown");
      ic("boot", { ...is, app_id });
    }
  } else {
    const d = document;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i: any = function(...args: unknown[]): void {
      i.c(args);
    };
    i.q = [];
    i.c = function(args: unknown): void {
      i.q.push(args);
    };

    w.Intercom = i;

    const l = function(): void {
      const s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${app_id}`;

      const x = d.getElementsByTagName("script")[0];
      if (x?.parentNode) x.parentNode.insertBefore(s, x);
      else d.getElementsByTagName("head")[0].append(s);
    };

    if (document.readyState === "complete") l();
    else if (w.attachEvent) w.attachEvent("onload", l);
    else w.addEventListener("load", l, false);
  }
}

// It helps us keep the library isomorphic, i.e. prevent errors when used in a SSR environment
const _isNotBrowser = typeof window === "undefined" || typeof document === "undefined";
let notBrowserSettings: IntercomSettings = { app_id: "APP_ID" };

export class Intercom {
  private static initialized = false;
  private static instance: Intercom;

  static getInstance(
    settings?: IntercomSettings
  ): Intercom {
    if (_isNotBrowser) {
      Intercom.instance = new Intercom(notBrowserSettings);
      return Intercom.instance;
    }

    if (!settings) settings = window.intercomSettings;

    if (
      !Intercom.instance ||
      (!!settings?.app_id && Intercom.instance.appId !== settings.app_id)
    ) {
      if (Intercom.instance?.appId) Intercom.instance.command("shutdown");
      Intercom.instance = new Intercom(settings);
    }

    return Intercom.instance;
  }

  constructor(settings: IntercomSettings) {
    if (typeof settings !== "object") {
      throw new TypeError(
        `Constructor called with invalid settings type ${typeof settings}, expected IntercomSettings`
      );
    }
    this.settings = settings;
    if (this.settings.app_id) this.boot();
  }

  init(): void {
    if (_isNotBrowser) return;

    if (!this.appId) {
      throw new Error("Init called with no app_id set");
    }

    if (!Intercom.initialized) {
      Intercom.initialized = true;
      injectIntercomScript(this.appId);
    }
  }

  boot(settings?: IntercomSettings): void {
    if (_isNotBrowser) return;

    if (settings) this.settings = settings;
    if (!Intercom.initialized) this.init();
    this.command("boot", this.settings);
  }

  destroy(): void {
    if (_isNotBrowser) return;

    this.command("shutdown");
    delete window.Intercom;
    delete window.intercomSettings;
  }

  get settings(): IntercomSettings {
    if (_isNotBrowser) return notBrowserSettings;

    return window.intercomSettings;
  }

  set settings(settings: IntercomSettings) {
    if (_isNotBrowser) {
      notBrowserSettings = settings;
      return;
    }
  
    window.intercomSettings = settings;
  }

  get appId(): string | undefined {
    return this.settings?.app_id;
  }

  command(command: IntercomCommand, options?: IntercomOptions): void {
    if (_isNotBrowser) return;

    if (!Intercom.initialized) {
      console.warn(
        "Intercom not initialized, skipping command",
        command,
        options
      );
      return;
    }

    try {
      window.Intercom(command, options);
    } catch (err) {
      console.error(
        "Failed to execute Intercom command",
        command,
        options,
        err
      );
    }
  }
}

export default Intercom.getInstance;
