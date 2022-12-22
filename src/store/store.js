import { createStore } from "redux";
import { taskReducer } from "./taskReducer";

const initialState = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: false },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: false },
];

export function initiateStore() {
  return createStore(taskReducer, initialState);
}
