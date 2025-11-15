let totalGoals = 0;
const scorers = [];

class PlayerInfo {
    constructor(id, firstName, lastName, goalsScored = 1) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
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
    teamsPlaying = document.getElementById("teams");
    periodeActuelle = document.getElementById("period");
    butsMarques = document.getElementById("scorers");

    teamsPlaying.textContent = `${info.awayTeam.abbrev} @ ${info.homeTeam.abbrev}`;
    periodeActuelle.innerHTML = `${info.displayPeriod}<sup>${info.displayPeriod > 1 ? "e" : "ère"}</sup> PÉRIODE`;
 
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
            player.lastName.default
        );

        totalGoals = currentGoalCount;
        displayScorers([...scorers.values()]);
    }
   

    function addScorer(id, firstName, lastName) {
    const previousGoals = scorers.filter(s => s.id === id).length;
    const newGoalNumber = previousGoals + 1;

    scorers.push(new PlayerInfo(id, firstName, lastName, newGoalNumber));
}
};


function displayScorers() {
    butsMarques.innerHTML = scorers
        .map(p => `But de ${p.firstName} ${p.lastName} (${p.goalsScored}<sup>${p.goalsScored > 1 ? "e" : "er"}</sup>)`)
        .join("<br>");
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
    getPlayByPLayInfo(2025020270);
    setInterval(() => getPlayByPLayInfo(2025020270), 5000);
};




document.addEventListener('DOMContentLoaded', () => {
    run()
});