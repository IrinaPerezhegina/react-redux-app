import { createSlice } from "@reduxjs/toolkit";
import todosService from "../services/todos.service";
import { setError } from "./errors";

const initialState = { entities: [], isLoading: true };

export function titleChanged(id) {
  return update({ id, title: `New Title for ${id}` });
}

export function taskDeleted(id) {
  return remove({ id });
}
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    push(state, action) {
      state.entities.push({ ...action.payload, completed: false });
      state.isLoading = false;
    },
    recieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    taskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailded(state) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recieved, taskRequested, taskRequestFailded, push } =
  actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.fetch();
    dispatch(recieved(data));
  } catch (error) {
    dispatch(taskRequestFailded());
    dispatch(setError(error.message));
  }
};
export const createTask = (n) => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.post(n);
    dispatch(push(data));
  } catch (error) {
    dispatch(taskRequestFailded());
    dispatch(setError(error.message));
  }
};
export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }));
};

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
