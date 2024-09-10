import React from 'react';
import { Store } from '.';

type StackState = {
  indexCounter: number;
  storeMap: Map<string, Store>;
};

type StackStore = {
  setStoreMap: (id: string, store: Store) => void;
  focus: (id: string) => void;
};

const stackState: StackState = {
  indexCounter: 0,
  storeMap: new Map(),
};

export function useStackStore(): StackStore {
  return React.useMemo(
    () => ({
      setStoreMap: (id, store) => {
        stackState.storeMap.set(id, store);
      },
      focus: (id) => {
        stackState.storeMap.forEach((value, key) => {
          if (key === id) {
            value.setState('index', ++stackState.indexCounter);
          }
          value.setState('focused', key === id);
        });
      },
    }),
    [],
  );
}
