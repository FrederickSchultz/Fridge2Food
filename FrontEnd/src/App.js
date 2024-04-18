import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './UserAuth/Loginpage';
import IngredientForm from './IngredientForm';
import Signup from "./UserAuth/Signup";
import ResetPassword from "./UserAuth/ResetPassword";
import ResetPasswordConfirm from "./UserAuth/ResetPasswordConfirm";
import Activate from "./UserAuth/Activate";

import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  return (
      <Provider store={store}>
            <Router> {/* Wrap your Routes in a Router */}
              <Routes>
                  <Route path="/my-fridge" element={<IngredientForm />} />
                  <Route path="/" element={<Homepage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
                  <Route path="/activate/:uid/:token" element={<Activate />} />
              </Routes>
            </Router>
      </Provider>
  );
};

export default App;
