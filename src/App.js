import './App.css';
import React from 'react';
import SqlGame from './SqlGame';

function App() {
  return (
    <div className="App">
      <main>
        <SqlGame /> 
      </main>

      <footer>
        <p>Copyright &copy; &mdash; {new Date().getFullYear()};
           Nika-studio</p>
      </footer>
    </div>
  );
}

export default App;
