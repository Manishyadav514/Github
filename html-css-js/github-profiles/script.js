const APIURL = "https://api.github.com/users/";

const challange31Card = document.getElementById("challange31Card");
const challange31Form = document.getElementById("challange31Form");
const challange31Search = document.getElementById("challange31Search");

getUser("Manishyadav514");

async function getUser(username) {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    createUserCard(respData);

    getRepos(username);
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

function createUserCard(user) {
    const cardHTML = `
        <div class="challange31Card">
            <div>
                <img class="challange31Image" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="challange31Texts">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `;

    challange31Card.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

challange31Form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = challange31Search.value;

    if (user) {
        getUser(user);

        challange31Search.value = "";
    }
});
