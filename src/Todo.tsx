import { useRef, useState } from "react";
import { useUpdate, useStateSelector, addTodo, removeTodo } from "./index";

export const Todo = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { update } = useUpdate();
  const todo = useStateSelector((state) => state.todo);

  console.log("TODO");

  return (
    <>
      <input ref={ref} />
      <button
        onClick={() => {
          update(
            addTodo({
              title: ref.current?.value,
              id: (+new Date()).toString(16)
            })
          );
        }}
      >
        add
      </button>
      <ul>
        {todo.map((t) => (
          <li key={t.id}>
            {t.title}{" "}
            <span
              onClick={() => {
                update(removeTodo(t.id));
              }}
            >
              remove
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
