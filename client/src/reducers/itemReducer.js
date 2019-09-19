import {
  GET_LIST
} from "../actions/types";


const initialState = {
  list:[],
};

export default function (state = initialState, action) {

  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        list: action.payload
      };

    default:
        return state;
  }

}