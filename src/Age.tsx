import { decrementAge, incrementAge, useStateSelector, useUpdate } from "./index";

export const Age = () => {
  const age = useStateSelector((state) => state.age);
  const { update } = useUpdate();

  console.log("AGE");

  return (
    <>
      <h2>{age}</h2>
      <button
        onClick={() => {
          update(incrementAge());
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          update(decrementAge());
        }}
      >
        -
      </button>
    </>
  );
};
