export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";

const initialState = {
  byId: {},
  allIds: [],
};

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS_SUCCESS: {
      const projects = action.payload;
      const byId = {};
      const allIds = [];

      projects.forEach((project) => {
        byId[project.id] = project;
        allIds.push(project.id);
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

export default projectsReducer;
