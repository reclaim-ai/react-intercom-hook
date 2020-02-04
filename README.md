# react-intercom-hook

Easy to use [React Hook](https://reactjs.org/docs/hooks-intro.html) for [Intercom](https://www.intercom.com/).

![NPM Publish](https://github.com/reclaim-ai/react-intercom-hook/workflows/NPM%20Publish/badge.svg)

## Features

* No need to mess with `index.html`, the Intercom script snippet is injected automatically
* Configurable in React, defaults to global window settings
* Automatically reboots when app id or user changes
* Exposes the standard [Intercom Javascript API](https://developers.intercom.com/installing-intercom/docs/intercom-javascript)
* Full Typescript definitions

## Install
```bash
# npm
$ npm install @reclaim-ai/react-intercom-hook

# yarn
$ yarn add @reclaim-ai/react-intercom-hook
```

## Quickstart

1. **Initialize Intercom by passing in settings somewhere near the root of your app, usually `App.tsx` or `App.jsx`.**

```typescript
// App.tsx

import React from 'react';
import useIntercom from '@reclaim-ai/react-intercom-hook';

const App: React.FC = () => {
  // Configure and initialize Intercom by passing a settings argument
  const intercom = useIntercom({
    app_id: INTERCOM_APP_ID,  // app_id is required
    // ...                       all other settings are optional
  });

  return (
    // ...
  );
}
```

2. **Include without arguments in any child component to interact with Intercom.**

```typescript
// AppRouter.tsx

import React, { useEffect } from 'react';
import useIntercom from '@reclaim-ai/react-intercom-hook';
import { BrowserRouter as Router, useLocation } from "react-router-dom";

const AppRouter: React.FC = () => {
  // Call with no arguments to get the current instance of Intercom
  const intercom = useIntercom();
  const location = useLocation();

  useEffect(() => {
      // Track route changes
      intercom('update');
  }, [intercom, location]);

  return (
    // ...
  );
}
```
