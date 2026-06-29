import React, { Suspense } from 'react';
const Lanyard = React.lazy(() => import('./Lanyard.jsx'));

export default function LanyardWrapper() {
  return (
    <Suspense fallback={null}>
      <Lanyard />
    </Suspense>
  );
}
