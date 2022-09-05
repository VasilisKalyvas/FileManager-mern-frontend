import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
  loading: false,
  error: false,
};

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {

    fetchStart: (state) => {
      state.loading = true;
    },

    fetchSuccess: (state) => {
      state.loading = false;
    },

    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },

    paths: (state, action) => {
      state.folders.push(action.payload);
    },

    removePath: (state, action) => {
      let Array = state.folders.slice(0, 
        state.folders.findIndex(x => x.folderId === action.payload) + 1).map((obj) => obj) 
        state.folders = Array
    },

    removeAllPaths: (state) => {
      state.folders = [];
    },

  },
});

export const {  paths, removePath, removeAllPaths, fetchStart, fetchSuccess, fetchFailure } =
  folderSlice.actions;

export default folderSlice.reducer;