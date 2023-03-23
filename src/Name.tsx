import {
  useStateSelector,
  useUpdate,
  updateName,
  store_state,
  store_update
} from "./index";

export const Name = () => {
  const name = useStateSelector((state) => state.name);
  const { update } = useUpdate();

  return (
    <>
      {name}
      <input
        value={name}
        onChange={(e) => {
          update((prevState) => {
            return {
              ...prevState,
              name: e.target.value
            };
          });
        }}
      />
    </>
  );
};
