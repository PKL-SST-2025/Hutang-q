import { Router, Route, A} from "@solidjs/router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transaction";
import Accounts from "./pages/Accounts";
import AddData from "./pages/AddData";
import AllData from "./pages/AllData";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordConfirmation from "./pages/EmailCheck";

export default function App() {
  return (
    <>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/Dashboard" component={Dashboard}/>
        <Route path="/Transaction" component={Transaction}/>
        <Route path="/Accounts" component={Accounts}/>
        <Route path="/AddData" component={AddData}/>
        <Route path="/AllData" component={AllData}/>
        <Route path="/Services" component={Services}/>
        <Route path="/Settings" component={Settings}/>
        <Route path="/SignIn" component={SignIn}/>
        <Route path="/SignUp" component={SignUp}/>
        <Route path="/ForgotPassword" component={ForgotPassword}/>
        <Route path="/ForgotPasswordConfirm" component={ForgotPasswordConfirmation}/>
      </Router>
    </>
  );
}
