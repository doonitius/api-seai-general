import '../App.css';

function SideBar() {
    const ajarnList = ["Aj. Jumpol",
        "Aj. Khajonpong",
        "Aj. Kharittha",
        "Aj. Marong",
        "Aj. Naruemon",
        "Aj. Natasha",
        "Aj. Nuntipat",
        "Aj. Nuttanart",
        "Aj. Peerapon",
        "Aj. Phond",
        "Aj. Piyanit",
        "Aj. Prapong",
        "Aj. Priyakorn",
        "Aj. Rajchawit",
        "Aj. Sanan",
        "Aj. Surapont",
        "Aj. Suthathip",
        "Aj. Santitham",
        "Aj. Thumrongrat",
        "Aj. Unchalisa"];
    const listItems = ajarnList.map((ajarnList) =>    <li key={ajarnList.toString()}>
        {ajarnList}
    </li>
    )
    return (
        <div className="sidebar">
            <div className="sideArea">
                <div className="topicSideArea">Tags Areas</div>
                <div className="sideAreaList">AI</div>
                <div className="sideAreaList">BI</div>
                <div className="sideAreaList">cat</div>
                <div className="sideAreaList">dog</div>
                
            </div>
            <div className="sideArea">
                <div className="topicSideArea">Advisor</div>
                <div className="sideAreaList">{listItems}</div>

            </div>
        </div>
    );
}

export  {SideBar};