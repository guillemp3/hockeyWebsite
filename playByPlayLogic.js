let totalGoals = 0;
const scorers = [];

class PlayerInfo {
    constructor(id, firstName, lastName, headshot, time, period, goalsScored = 1) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.headshot = headshot;
        this.time = time;
        this.period = period;
        this.goalsScored = goalsScored;
    }
}


async function getPlayByPLayInfo(id) {
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

async function displayLiveInfo(info) {

    //if entracte, hide everything and show new interface
    teamsPlaying = document.getElementById("teams");
    periodeActuelle = document.getElementById("period");
    butsMarques = document.getElementById("scorers");
    const penaltyBox = document.getElementById("penaltyBox")
    teamsPlaying.textContent = `${info.awayTeam.abbrev} @ ${info.homeTeam.abbrev}`;
    periodeActuelle.innerHTML = `${info.displayPeriod}<sup>e</sup> PÉRIODE ${info.clock.timeRemaining} <br> ${info.clock.running=false? "en pause":"la rondelle est en jeu!"} <br> entracte: ${info.clock.inIntermission}`;
    
    penaltyBox.innerHTML = `${(info.summary.iceSurface.homeTeam.penaltyBox).map(p => p.name.default)} <br> ${(info.summary.iceSurface.awayTeam.penaltyBox).map(p => p.name.default)}`

    // console.log((info.summary.iceSurface.homeTeam.penaltyBox).map(p => p.name.default));
    //  console.log((info.summary.iceSurface.awayTeam.penaltyBox).map(p => p.name.default));


    const goalPlays = info.plays.filter(play => play.typeDescKey === "goal");
    const currentGoalCount = goalPlays.length;

    if (currentGoalCount === totalGoals) {
        return; //pour eviter d'update a chaque 5 secondes
    }

    for (const goal of goalPlays) {

        const scorerId = goal.details.scoringPlayerId;
        const player = await getPlayerById(scorerId);

        addScorer(
            scorerId,
            player.firstName.default,
            player.lastName.default,
            player.headshot,
            goal.timeInPeriod,
            goal.periodDescriptor.number
        );

        totalGoals = currentGoalCount;
        displayScorers([...scorers.values()]);
        // console.log(info);
        //         //ON PEUT AJOUTER LES INTERMISSIONS!!   
        //.clock.inIntermission
        //.clock.running
    }


    function addScorer(id, firstName, lastName, headshot, time, period) {
        const previousGoals = scorers.filter(s => s.id === id).length;
        const newGoalNumber = previousGoals + 1;

        scorers.push(new PlayerInfo(id, firstName, lastName, headshot, time, period, newGoalNumber));
    }
};


function displayScorers() {
    const scorersContainer = document.getElementById("scorers");
    scorersContainer.innerHTML = scorers
        .map(p => `
            <div class="scorer">
                <img src="${p.headshot}" alt="${p.firstName} ${p.lastName}" class="scorer-img">
                <div class="scorer-text">
                    <div class="main-text">
                        But de ${p.firstName} ${p.lastName} (${p.goalsScored}<sup>${p.goalsScored > 1 ? "e" : "er"}</sup>)
                    </div>
                    <div class="sub-text">${p.time} (en ${p.period}<sup>e</sup> période)</div>
                </div>
            </div>
        `)
        .join("");
    
    
    
}


async function getPlayerById(id) {

    const Response = await fetch(`http://localhost:3000/api/player/${id}`);

    if (!Response.ok) {
        throw new Error(`Response status: ${Response.status}`);
    }
    const Result = await Response.json();
    return Result;

};


function run() {
    getPlayByPLayInfo(2025020285);
    setInterval(() => getPlayByPLayInfo(2025020285), 5000);
};




document.addEventListener('DOMContentLoaded', () => {
    run()
});