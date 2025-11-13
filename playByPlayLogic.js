

async function getPlayByPLayInfo(id){
    try {
        const Response = await fetch(`http://localhost:3000/api/playbyplay/${id}`);
        if (!Response.ok) {
            throw new Error(`Response status: ${Response.status}`);
        }
        console.log('PlayByPlay API response received.');

        const Result = await Response.json();
        displayLiveInfo(Result);
       
    }
    catch (error) {
        console.error(error.message);
        const contentDiv = document.getElementById('liveDataBox');
        contentDiv.textContent = 'erreur.';
    }
};


function displayLiveInfo(info){
    teamsPlaying = document.getElementById("teams");
    teamsPlaying.textContent = `${info.awayTeam.abbrev} @ ${info.homeTeam.abbrev}`;


};


function run(){
    console.log("allo")
    setInterval(() => getPlayByPLayInfo(2025020270), 5000);
};

document.addEventListener('DOMContentLoaded', () => {

    run()


    // getPlayByPLayInfo(2025020270);
    
});