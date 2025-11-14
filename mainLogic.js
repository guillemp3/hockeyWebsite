// async function getStandingsData() {
//     try {
//         const standingsResponse = await fetch('http://localhost:3000/api/standings');
//         if (!standingsResponse.ok) {
//             throw new Error(`Response status: ${standingsResponse.status}`);
//         }

//         const standingsResult = await standingsResponse.json();
//         const bestTeam = standingsResult.standings[0].teamName.fr;
//         const contentDiv = document.getElementById('teamDisplayer');
//         contentDiv.textContent = `La meilleure équipe est ${bestTeam}`;
//     }
//     catch (error) {
//         console.error(error.message);
//         const contentDiv = document.getElementById('content');
//         contentDiv.textContent = 'erreur.';
//     }
// }



async function getHabsData(playerNumber) {
    try {

        const Response = await fetch('http://localhost:3000/api/habs');
        if (!Response.ok) {
            throw new Error(`Response status: ${Response.status}`);
        }
        console.log('Habs API response received.');

        const Result = await Response.json();
        console.log(Result);

        player = Result.skaters[playerNumber];

        fullName = `${player.firstName.default} ${player.lastName.default}`;
        imageVisage = player.headshot;
        const displayer = document.getElementById('nameBox');
        const myImage = document.getElementById('photoVisage');

        // statistiques individuelles
        generateStats(player.goals, player.assists, player.points, player.plusMinus, player.penaltyMinutes, player.gamesPlayed);


        displayer.textContent = fullName;
        myImage.src = imageVisage;
    }
    catch (error) {
        console.error(error.message);
        const contentDiv = document.getElementById('content');
        contentDiv.textContent = 'erreur.';
    }

}




function generateStats(goals, assists, points, plusMinus, pim, gamesPlayed){
    statBox = document.getElementById("rightBox");
    statBox.innerHTML = `
    <p>${goals}G   ${assists}A
       ${points}P   ${gamesPlayed}GP</p>`;
}

let currPlayerNumber = 0;

//horrible placement
rightBox = document.getElementById("rightBox");
leftBox = document.getElementById("leftBox");

document.addEventListener('DOMContentLoaded', () => {

    const standingsButton = document.getElementById('bestTeamBtn');
    if (standingsButton) {
        standingsButton.addEventListener('click', getStandingsData);
    }

    const prev = document.getElementById('prevPlayerBtn');
    if (prev) {
        prev.addEventListener('click', () => {
            if (currPlayerNumber > 0) {
                currPlayerNumber -= 1;
                getHabsData(currPlayerNumber);
            }
        });
    }
    const next = document.getElementById('nextPlayerBtn');
    if (next) {
        next.addEventListener('click', () => {
            if (currPlayerNumber < 21) {
                currPlayerNumber += 1;
                getHabsData(currPlayerNumber);
            }
        });
    }



    const habsButton = document.getElementById('habsBtn');
    if (habsButton) {
        habsButton.addEventListener('click', () => {
            getHabsData(currPlayerNumber);
            // getPlayByPLay(2025020270);
            next.style.display = "block";
            prev.style.display = "block";
            leftBox.style.display = "flex";
            rightBox.style.display = "block";
            habsButton.style.display = "none";

        });
    }

    // const liveDataBtn = document.getElementById('liveDataBtn');
    // if (liveDataBtn) {
    //     liveDataBtn.addEventListener('click', () => {
    //         getPlayByPLay(2025020270);
    //     });
    // }
});