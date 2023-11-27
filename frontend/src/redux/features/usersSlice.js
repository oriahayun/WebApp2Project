import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: null,
};

export const usersSlice = createSlice({
  initialState,
  name: 'usersSlice',
  reducers: {
    logout: () => initialState,
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export default usersSlice.reducer;

export const { setUsers } = usersSlice.actions;
