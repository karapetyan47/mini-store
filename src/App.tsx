import "./styles.css";
import { Name } from "./Name";
import { Todo } from "./Todo";
import { Age } from "./Age";
import { Other } from "./Other";

export default function App() {
  console.log("hello world");
  return (
    <div className="App">
      <Name />
      <br />
      <br />
      <Age />
      <br />
      <br />
      <Todo />
      <br />
      <br />
      <Other />
    </div>
  );
}
