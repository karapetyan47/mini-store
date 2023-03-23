import { useStateSelector } from "./";

export const Other = () => {
  const other = useStateSelector((state) => state.other);

  console.log("OTHER");

  return <pre>{JSON.stringify(other, null, 4)}</pre>;
};
