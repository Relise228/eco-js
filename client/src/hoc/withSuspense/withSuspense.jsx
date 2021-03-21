import React from 'react';

export function withSuspense(WrappedComponent) {
  return (props) => {
    return (
      <React.Suspense fallback={<div>Loading....</div>}>
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
}
