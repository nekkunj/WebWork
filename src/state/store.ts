import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk"
import thunkMiddleware  from "redux-thunk";
import reducers from "./reducers";

export const store =  createStore(    //It is not depreciated
    reducers,
    // applyMiddleware(thunk)
)  


