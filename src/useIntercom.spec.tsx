/* eslint-disable @typescript-eslint/camelcase */
import { renderHook, act } from "@testing-library/react-hooks";
import { Intercom, IntercomSettings } from "./Intercom";
import { useIntercom } from "./useIntercom";

beforeEach(() => {
  // clear global settings
  delete window.Intercom;
  delete window.intercomSettings;

  // reset static state
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  Intercom.initialized = false;

  // mock init method and window.Intercom
  Intercom.prototype.init = jest
    .fn()
    .mockImplementation(function(this: Intercom) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      Intercom.initialized = true;

      if (!window.Intercom)
        window.Intercom = jest.fn().mockImplementation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (command: string, options?: any): void => {
            console.debug("intercom command", command, options);

            switch (command) {
              case "boot":
                window.intercomSettings = { ...(options || {}) };
                break;
              case "update":
                window.intercomSettings = {
                  ...(window.intercomSettings || {}),
                  ...(options || {}),
                };
            }
          }
        );
    });
});

describe("init", () => {
  test("should provide instance of Intercom", () => {
    const { result } = renderHook(() => useIntercom({ app_id: "" }));

    expect(result.current).toBe(Intercom.prototype.command);
  });

  test("should not initialize without app_id", () => {
    renderHook(() => useIntercom({ app_id: "" }));

    expect(Intercom.getInstance().init).not.toHaveBeenCalled();
  });

  test("should initialize with app_id", () => {
    renderHook(() => useIntercom({ app_id: "abc" }));

    expect(Intercom.getInstance().init).toHaveBeenCalledTimes(1);
  });

  test("should only initialize once", () => {
    renderHook(() => useIntercom({ app_id: "abc" }));
    renderHook(() => useIntercom({ app_id: "abc" }));

    expect(Intercom.getInstance().init).toHaveBeenCalledTimes(1);
  });

  test("should provide same instance", () => {
    const { result: i1 } = renderHook(() => useIntercom({ app_id: "abc" }));
    const { result: i2 } = renderHook(() => useIntercom());

    expect(Intercom.getInstance().appId).toEqual("abc");
    expect(i2.current).toBe(i1.current);
  });

  test("should not throw if command called before init", () => {
    const { result } = renderHook(() => useIntercom());

    act(() => {
      expect(() => result.current("update", { email: "dev@reclaimai.com" })).not.toThrow();
    });
  });
});

describe("configuration", () => {
  test("should use global settings by default", () => {
    window.intercomSettings = { app_id: "abc" };
    renderHook(() => useIntercom());

    expect(Intercom.getInstance().appId).toEqual("abc");
  });

  test("should accept settings", () => {
    const settings: IntercomSettings = {
      app_id: "abc",
      user_id: "123",
      email: "testerson@reclaimai.com",
    };
    renderHook(() => useIntercom(settings));

    expect(Intercom.getInstance().settings).toEqual(settings);
  });

  test("should match window.intercomSettings", () => {
    const settings: IntercomSettings = {
      app_id: "def",
      user_id: "456",
      email: "mctesty@reclaimai.com",
    };
    renderHook(() => useIntercom(settings));

    expect(window.intercomSettings).toEqual(Intercom.getInstance().settings);
  });
});

describe("user", () => {
  test("should update when user id provided", () => {
    const { result } = renderHook(() => useIntercom({ app_id: "abc" }));
    const data = { user_id: "123" };

    act(() => {
      result.current("update", data);
    });

    expect(window.intercomSettings.user_id).toEqual("123");
    expect(window.Intercom).toHaveBeenCalledWith("update", data);
  });

  test("should update when user email provided", () => {
    const { result } = renderHook(() => useIntercom({ app_id: "abc" }));
    const data = { email: "bobby@reclaimai.com" };

    act(() => {
      result.current("update", data);
    });

    expect(window.intercomSettings.email).toEqual("bobby@reclaimai.com");
    expect(window.Intercom).toHaveBeenCalledWith("update", data);
  });

  test("should reboot when user info changes", () => {
    const updated = { app_id: "abc", email: "sally@reclaimai.com" };
    renderHook(() =>
      useIntercom({ app_id: "abc", email: "bobby@reclaimai.com" })
    );
    renderHook(() => useIntercom(updated));

    expect(window.intercomSettings.email).toEqual(updated.email);
    expect(window.Intercom).toHaveBeenCalledWith("shutdown", undefined);
    expect(window.Intercom).toHaveBeenCalledWith("boot", updated);
  });
});
