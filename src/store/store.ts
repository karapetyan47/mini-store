import { unstable_batchedUpdates } from "react-dom";
import { cloneDeep } from "lodash";

export type Handler<T, R extends string> = {
  [key in R]: (state: T, payload?: any) => void;
};

interface H<T> {
  action: T;
  payload?: any;
}

type Action<R extends string | number> = {
  [key in R]: (
    payload?: any
  ) => {
    actionKey: R;
    payload: any;
  };
};

type UpdateActionFunction<T> = (state: T) => T;

type UpdateAction<T, R> =
  | UpdateActionFunction<T>
  | { actionKey: R; payload?: any };

export class Store<T, R extends string> {
  private subscriptions: (() => void)[] = [];
  private state: T;
  private handlers: Handler<T, R>;

  public actions: Action<R>;

  constructor(initialState: T, handlers: Handler<T, R>) {
    this.state = cloneDeep(initialState);
    this.handlers = handlers;
    this.actions = this.createHandlerAction();
  }

  getState = () => {
    return this.state;
  };

  createHandlerAction = () => {
    type ActionKey = keyof typeof this.handlers;

    const actions: Action<ActionKey> = {} as Action<ActionKey>;

    (Object.keys(this.handlers) as Array<ActionKey>).forEach((handlerKey) => {
      actions[handlerKey as ActionKey] = (payload?: any) => {
        return {
          actionKey: handlerKey,
          payload
        };
      };
    });

    return actions;
  };

  updateWithCallback = (cb: UpdateActionFunction<T>) => {
    this.state = cb(this.state);
    this.notify();
  };

  updateWithHandler = ({ action, payload }: H<R>) => {
    if (!this.handlers[action]) {
      throw new Error("Handler does not exists");
    }

    this.handlers[action](this.state, payload);
    this.notify();
  };

  update = (action: UpdateAction<T, R>) => {
    if (typeof action === "object") {
      const { actionKey, payload } = action;
      this.updateWithHandler({ action: actionKey, payload });
      return;
    }

    if (typeof action === "function") {
      this.updateWithCallback(action);
      return;
    }
  };

  notify = () => {
    unstable_batchedUpdates(() => {
      this.subscriptions.forEach((cb) => {
        cb();
      });
    });
  };

  subscribe = (cb: () => void) => {
    this.subscriptions.push(cb);

    return () => {
      const index = this.subscriptions.indexOf(cb);

      if (index === -1) {
        return;
      }

      this.subscriptions.splice(index, 1);
    };
  };

  clear_store = (initialState: T, handlers: Handler<T, R>) => {
    this.state = cloneDeep(initialState);
    this.handlers = handlers;
    this.actions = this.createHandlerAction();
    this.subscriptions = [];
  };
}
