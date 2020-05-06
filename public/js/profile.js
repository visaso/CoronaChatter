

    'use strict';

    const apiURL = 'https://localhost:8000/graphql';

    const feedButton = document.getElementById('feedBtn');
    const exploreButton = document.getElementById('exploreBtn');
    const profileButton = document.getElementById('profileBtn');
    const deleteUserButton = document.getElementById('deleteUserBtn');
    const logoutButton = document.getElementById('logoutBtn');
    //const feed = document.getElementById('feed');
    const topicListE = document.getElementById('topicListE');
    const profile = document.getElementById('profile');
    const usernameLabel = document.getElementById('usernameLabel');
    //const settings = document.getElementById('settings');
    let userData = {};

    window.onload = function() {
        'use strict';
        loadProfile();

    }


    const fetchGraphql = async (query) => {
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query: query}),
        };
        try {
            const response = await fetch(apiURL, options);
            const json = await response.json();
            return json.data;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };

    const loadProfile = async (e) => {

        const query = `{
            user(id:"${localStorage.getItem('userid')}") {
              username
              fullName
              dateCreated
              topics {
                title
                description
                media
              }
            }
          }`;

        const data = await fetchGraphql(query);
        userData = data;
        console.log(userData);
        
        usernameLabel.innerHTML = data.user.username;

        console.log('data returned:', data)
        const profile = document.getElementById('profile');
        /*
        profile.innerHTML = `          <div class="card" style="width: 100%;">
        <img class="card-img-top rounded-circle" src="./img/rippled-swedish-flag-720.jpg" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${data.user.username}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
      </div><br><div>
    </div>`;
        */
          
        if (data.user.topics.length < 1) {
        } else {
          topicListE.innerHTML = "";
          data.user.topics.forEach((type) => {
            const html = `<div class="card" style="width: 100%; margin: auto;">
            <div class="card-body" style="display: inline-flex; justify-content: space-between;">
            <h5 class="card-title">${type.title}</h5>
            <a href="#" class="btn btn-primary">Subscribe</a>
            </div>
            </div>
            <br>`;
            const topicList = document.createElement("div");
            topicList.innerHTML = html;
            topicListE.appendChild(topicList);
          });
        }
    }

    const deleteUser = async (e) => {
      const query = `mutation {
        deleteUser(id:"${userData.user.id}") {
          username
        }
      }`;

      try {    
        const data = await fetchGraphql(query);
        console.log(data);
        location.href="https://localhost:8000/login";
      } catch (e) {
        console.log(e.message);
      }
    }

    const logout = async (e) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userid');
      location.href='https://localhost:8000/login';
    }

    deleteUserButton.addEventListener('click', (e) => {
      deleteUser(e);
    })
    logoutButton.addEventListener('click', (e) => {
      logout(e);
    })
        
