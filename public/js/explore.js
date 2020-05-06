

    'use strict';

    const apiURL = 'https://localhost:8000/graphql';

    const feedButton = document.getElementById('feedBtn');
    const exploreButton = document.getElementById('exploreBtn');
    const profileButton = document.getElementById('profileBtn');
    const deleteUserButton = document.getElementById('deleteUserBtn');
    const feed = document.getElementById('feed');
    const target = document.getElementById('target');
    const welcome = document.getElementById('welcome');
    const explore = document.getElementById('explore');
    const profile = document.getElementById('profile');
    const settings = document.getElementById('settings');
    let userData = {};

    window.onload = function() {
        'use strict';
        /*  
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
                   .register('./sw.js');
        }
        */
        loadFeed();
        
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

    const loadFeed = async (e) => {
        const query = `{
          topics {
            id
            title
            description
            users {
              username
            }
          }
        }`;

        const data = await fetchGraphql(query);

        console.log('data returned:', data)
        //console.log('posts', data.user.topics[0].posts);
        const feed = document.getElementById('feed');
        feed.innerHTML = "";

        let templateO = `<div class="alert alert-primary" style="margin-top: 10px;">
        These are the topics currently active.
        </div>`;
      $('#welcome').append(Mustache.render(templateO, data));

      if (data.topics < 1) {
        target.innerHTML = `<div class="alert alert-danger" style="margin-top: 10px;">
        Looks like you haven't subscribed to any topics yet! Head over to the Explore-tab to find interesting topics.
        </div>`
      } else {
        $.each(data.topics, function(index, item) {
          console.log(item);

            let templateO = `<div class="card" style="width: 95%; margin: auto;">
            <div class="card-body">
            <p style="margin:1px;"><em>{{ title }}</em></p>
            <h5 class="card-title"></h5>
            <p class="card-text">{{ description }}</p>
            <button class="btn btn-primary" onclick="subscribeTopic('${item.id}')"><i class="fas fa-plus"> Subscribe</i></button>
            </div>
            </div>
            <br>`;
            $('#target').append(Mustache.render(templateO, item));
        });
      }
    }

    const subscribeTopic = async (id) => {
      console.log(id);

      const query = `mutation {
        addUserToTopic(user:"${localStorage.getItem('userid')}" topic:"${id}") {
          username
        }
      }`;

      const data = await fetchGraphql(query);

      
      //location.href="./post.html?id=" + id;
    }
      
    const loadExplore = async (e) => {
      const query = `{
        topics {
          id
          title
          description
          media
            }
          }`;

        const data = await fetchGraphql(query);

        console.log('data returned:', data)
        const explore = document.getElementById('explore');
        explore.innerHTML = "";
        data.topics.forEach((type) => {


        const html = `<div class="card" style="width: 100%; margin: auto;">
            <img class="card-img-top" src="./img/rippled-swedish-flag-720.jpg" alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">${type.title}</h5>
            <p class="card-text">${type.description}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        <br>`;
        const carde = document.createElement("div");
        carde.innerHTML = html;
        explore.appendChild(carde);
        });

    }

    
    feedButton.addEventListener('click', (e) => {
        loadFeed(e);
    })
    exploreButton.addEventListener('click', (e) => {
        loadExplore(e);
    })

        
