import { cloneDeep, isEqual } from 'lodash';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

import { Handler, Store } from './store';

export function createStore<T, R extends string>({
  initialState,
  handlers
}: {
  initialState: T;
  handlers: Handler<T, R>;
}) {
  const Context = createContext<Store<T, R> | null>(null);

  const store = new Store(initialState, handlers);
  const actions = store.actions;
  const store_update = store.update;
  const store_state = store.getState;

  const Provider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
      return () => {
        store.clear_store(initialState, handlers);
      };
    }, []);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const store = useContext(Context);

    if (!store) {
      throw new Error('Can not use `useStore` outside of the `Provider`');
    }

    return store;
  };

  const useStateSelector = <Result extends any>(
    selector: (state: T) => Result
  ): Result => {
    const store = useStore();
    const [state, setState] = useState(() =>
      selector(cloneDeep(store.getState()))
    );

    const stateRef = useRef(state);

    useLayoutEffect(() => {
      stateRef.current = state;
    });

    useEffect(() => {
      return store.subscribe(() => {
        const state = selector(cloneDeep(store.getState()));

        if (isEqual(stateRef.current, state)) {
          return;
        }

        setState(state);
      });
    }, [store]);

    return state;
  };

  const useUpdate = () => {
    const store = useStore();

    return { update: store.update };
  };

  return {
    Provider,
    useStateSelector,
    useUpdate,
    actions,
    unsafe_store_state: store_state,
    unsafe_store_update: store_update
  };
}
