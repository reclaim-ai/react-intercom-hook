# react-intercom-hook

[React Hook](https://reactjs.org/docs/hooks-intro.html) for cleanly integrating [Intercom](https://www.intercom.com/) into React apps. 


## Install
```
# npm
npm install @reclaim-ai/react-intercom-hook

# yarn
yarn add @reclaim-ai/react-intercom-hook
```

## Usage

1. Initialize Intercom somewhere near the root of your app, usually in `App.tsx` or `App.jsx`.

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

2. Include the `useIntercom` hook anywhere you want to interact with Intercom.

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
