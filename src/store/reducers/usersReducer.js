export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";

const initialState = {
  byId: {},
  allIds: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS: {
      const users = action.payload;
      const byId = {};
      const allIds = [];

      users.forEach((user) => {
        byId[user.id] = user;
        allIds.push(user.id);
      });

      return {
        ...state,
        byId,
        allIds,
      };
    }

    default:
      return state;
  }
};

export default usersReducer;
