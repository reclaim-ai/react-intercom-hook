/* eslint-disable @typescript-eslint/camelcase */
import { renderHook, act } from '@testing-library/react-hooks';
import { Intercom, IntercomSettings } from '.';
import { useIntercom } from './useIntercom';

beforeAll(() => {
  // mock init method
  Intercom.prototype.init = jest.fn().mockImplementation(function (this: Intercom) {
    window.Intercom = jest.fn().mockImplementation((command, options): void => {
      console.debug('intercom command', command, options);
    });
  });
})

beforeEach(() => {
  // clear global settings
  delete window.Intercom;
  delete window.intercomSettings;
});

describe('init', () => {
  test('should provide instance of Intercom', () => {
    const { result } = renderHook(() => useIntercom({ app_id: '' }));

    // act(() => {
    //   result.current
    // });

    expect(result.current).toBeInstanceOf(Intercom);
  });

  test('should not initialize without app_id', () => {
    const { result } = renderHook(() => useIntercom({ app_id: '' }));
    expect(result.current.init).not.toHaveBeenCalled();
  });

  test('should initialize with app_id', () => {
    const { result } = renderHook(() => useIntercom({ app_id: 'abc' }));
    expect(result.current.init).toHaveBeenCalledTimes(1);
  });

  test('should provide same instance', () => {
    const { result: i1 } = renderHook(() => useIntercom({ app_id: 'abc' }));
    const { result: i2 } = renderHook(() => useIntercom());

    expect(i2.current.appId).toEqual('abc');
    expect(i2.current).toBe(i1.current);
  });
});

describe('configuration', () => {
  test('should accept settings', () => {
    const settings: IntercomSettings = { app_id: 'abc', user_id: '123', email: 'testerson@reclaimai.com' }
    const { result } = renderHook(() => useIntercom(settings));
  
    expect(result.current.settings).toEqual(settings);
  });

  test('should match window.intercomSettings', () => {
    const settings: IntercomSettings = { app_id: 'def', user_id: '456', email: 'mctesty@reclaimai.com' }
    const { result } = renderHook(() => useIntercom(settings));
  
    expect(window.intercomSettings).toEqual(result.current.settings);
  });
});

describe('user', () => {
  test('should update when user data provided', () => {
    const { result } = renderHook(() => useIntercom({ app_id: 'abc' }));
    const data = { email: 'bobby@reclaimai.com' };

    act(() => {
      result.current.set(data);
    });
  
    expect(window.intercomSettings.email).toEqual('bobby@reclaimai.com');
    expect(window.Intercom).toHaveBeenCalledWith('update', data);
  });

  test('should match window.intercomSettings', () => {
    const settings: IntercomSettings = { app_id: 'def', user_id: '456', email: 'mctesty@reclaimai.com' }
    const { result } = renderHook(() => useIntercom(settings));
  
    expect(window.intercomSettings).toEqual(result.current.settings);
  });
});