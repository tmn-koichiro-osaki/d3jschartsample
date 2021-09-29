import React from 'react'; 
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import top from './Top';
import ComboChart from './Chart/Combo/ComboChart';

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={top} />　
          <Route exact path="/combochart" component={ComboChart} />　
        </Switch>
      </BrowserRouter>
    );
  };
}

export default App;