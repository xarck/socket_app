import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Video from "./components/Video";
import { DataProvider } from "./context/data";

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/chat/:room" component={Chat} />
          <Route exact path="/call/:room" component={Video} />
        </Switch>
      </DataProvider>
    </BrowserRouter>
  );
}
