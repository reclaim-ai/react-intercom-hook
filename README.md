# react-intercom-hook

<p align="center">Easy to use [React Hook](https://reactjs.org/docs/hooks-intro.html) for [Intercom](https://www.intercom.com/).</p>

<p align="center">![NPM Publish](https://github.com/reclaim-ai/react-intercom-hook/workflows/NPM%20Publish/badge.svg)</p>

## Install
```bash
# npm
$ npm install @reclaim-ai/react-intercom-hook

# yarn
$ yarn add @reclaim-ai/react-intercom-hook
```

## Features

* Inject the global Intercom JS snippet automatically
* Supports configuring Intercom in React or default global settings
* Automatically restarts session when app id or user changes
* Exposes the [Intercom Javascript API](https://developers.intercom.com/installing-intercom/docs/intercom-javascript)
* Fully Typescript

## Quickstart

1. Initialize Intercom somewhere near the root of your app, usually `App.tsx` or `App.jsx`.

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

2. Include in any child component to interact with the [Intercom Javascript API](https://developers.intercom.com/installing-intercom/docs/intercom-javascript).

```typescript
// AppRouter.tsx

import React, { useEffect } from 'react';
import useIntercom from '@reclaim-ai/react-intercom-hook';
import { BrowserRouter as Router, useLocation } from "react-router-dom";

const AppRouter: React.FC = () => {
  // Without arguments, returns a handle to the current instance of Intercom
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
