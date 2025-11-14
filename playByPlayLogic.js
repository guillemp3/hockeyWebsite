
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

async function displayLiveInfo(info){
    teamsPlaying = document.getElementById("teams");
    periodeActuelle = document.getElementById("period");
    butsMarques = document.getElementById("scorers");
    teamsPlaying.textContent = `${info.awayTeam.abbrev} @ ${info.homeTeam.abbrev}`;
    periodeActuelle.textContent = `PÉRIODE ${info.displayPeriod}  ${info.clock.timeRemaining}`;
    
    

    const goalPlays = info.plays.filter(play => play.typeDescKey === "goal");
     for (const goal of goalPlays) {
        // console.log("Scorer ID:", goal.details.scoringPlayerId);
        const player = await getPlayerById(goal.details.scoringPlayerId);

        // console.log(`But de ${player.firstName.default} ${player.lastName.default}`);

       // addScorer(scoringPlayerId) ENVOYER UNE SEULE FOIS LE BUT

        // butsMarques.textContent += `But de ${player.firstName.default} ${player.lastName.default}`;
        
    }
    



};
async function getPlayerById(id){
   
    const Response = await  fetch(`http://localhost:3000/api/player/${id}`);

        if (!Response.ok) {
            throw new Error(`Response status: ${Response.status}`);
        }
        const Result = await Response.json();
        return Result;
    
    };

function run(){
    console.log("allo")
    setInterval(() => getPlayByPLayInfo(2025020270), 2000);
};

document.addEventListener('DOMContentLoaded', () => {

    run()


    // getPlayByPLayInfo(2025020270);
    
});