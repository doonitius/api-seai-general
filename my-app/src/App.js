import './App.css';
import { NavBar } from './components/Navbar';
import { SideBar } from './components/SideBar';
import { FilterArea } from './components/FilterArea' 

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div>
        <SideBar/>
        <div>
          <FilterArea/>
        </div>
        
      </div>
      
    </div>
  );
}

export default App;
