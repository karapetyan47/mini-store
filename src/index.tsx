import { createRoot } from "react-dom/client";

import App from "./App";
import { createStore } from "./store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

type Todo = {
  id: string | number;
  title: string;
};

type Store = {
  name: string;
  age: number;
  todo: Todo[];
  other: any;
};

const initialState: Store = {
  name: "",
  age: 10,
  todo: [],
  other: {}
};

const {
  Provider,
  useStateSelector,
  useUpdate,
  actions,
  store_state,
  store_update
} = createStore({
  initialState,
  handlers: {
    updateName: (state, payload) => {
      state.name = payload;
    },

    updateAge: (state, payload) => {
      state.age = payload;
    },
    addTodo: (state, payload) => {
      state.todo.push(payload);
    },
    removeTodo: (state, payload) => {
      state.todo = state.todo.filter((t) => t.id !== payload);
    },
    incrementAge: (state) => {
      state.age++;
    },
    decrementAge: (state) => {
      state.age--;
    },
    changeOther: (state, payload) => {
      state.other = payload;
    }
  }
});

root.render(
  <Provider>
    <App />
  </Provider>
);

const {
  updateAge,
  updateName,
  addTodo,
  removeTodo,
  incrementAge,
  decrementAge
} = actions;

export {
  useStateSelector,
  useUpdate,
  updateAge,
  updateName,
  addTodo,
  removeTodo,
  incrementAge,
  decrementAge,
  store_state,
  store_update
};
