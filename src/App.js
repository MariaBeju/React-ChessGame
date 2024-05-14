import './App.css';
import Board from './components/Board/Board';
import { reducer } from './reducer/reducer'
import { useEffect, useReducer } from 'react'
import { initGameState } from './constants';
import AppContext from './contexts/Context'
import { setPositionsFromLocalStorage } from './reducer/actions/move';

function App() {
    const [appState, dispatch ] = useReducer(reducer,initGameState);
    const providerState = {
        appState,
        dispatch,
    }

    useEffect(() => {
        if(localStorage.getItem('lastPosition') && localStorage.getItem('lastPosition') !== 'undefined') {
            dispatch(setPositionsFromLocalStorage({
                positions: JSON.parse(localStorage.getItem('lastPosition')),
                nextTurn: localStorage.getItem('nextTurn')
            }))
        }
    }, []);
  
    return (
      <AppContext.Provider value={providerState}>
        <div className="App">
          <Board />
        </div>
      </AppContext.Provider>
    ); 
}

export default App;
