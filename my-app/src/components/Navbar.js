import '../App.css';
import picCPE from '../images/CPE-logo.png'


function NavBar() {
    return (
    <div className="navbar">
        <div>
            <img className="pic-1" src={picCPE} alt=""></img>
        </div>
        <div className="searchArea">
            <input className="input-1" type="text" placeholder="Search project name, related tags or keywords.."></input>
            <button className="button-1">Search</button>
        </div>
        
    </div>
    );
}

export  {NavBar};