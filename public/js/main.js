

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
          user(id: "${localStorage.getItem('userid')}") {
            username
            fullName
            dateCreated
            topics {
              title
              description
              media
              posts {
                id
                title
                user {
                  username
                }
                text
              }
            }
          }
        }`;

        const data = await fetchGraphql(query);

        console.log('data returned:', data)
        //console.log('posts', data.user.topics[0].posts);
        const feed = document.getElementById('feed');
        feed.innerHTML = "";

        let templateO = `<div class="alert alert-primary" style="margin-top: 10px;">
        Hello <b>{{ user.username }}</b>, this is your feed
        </div>`;
      $('#welcome').append(Mustache.render(templateO, data));

      if (data.user.topics.length < 1) {
        target.innerHTML = `<div class="alert alert-danger" style="margin-top: 10px;">
        Looks like you haven't subscribed to any topics yet! Head over to the Explore-tab to find interesting topics.
        </div>`
      } else {
        $.each(data.user.topics, function(index, item) {
          console.log(item);
          $.each(item.posts, function(index, itemO) {
            console.log(itemO);
            let templateO = `<div class="card" style="width: 95%; margin: auto;">
            
            <div class="card-body">
            <p style="margin:1px;"><em>User: {{ user.username }}</em></p>
            <h3 style="margin:1px;"><em>Title: {{ title }}</em></h3>
            <h5 class="card-title"></h5>
            <p class="card-text">{{text}}</p>
            <button class="btn btn-primary" onclick="readPost('${itemO.id}')"><i class="fas fa-search">Read</i></button>
            </div>
            </div>
            <br>`;
            $('#target').append(Mustache.render(templateO, itemO));
          });
        });
      }
    }

    const readPost = async (id) => {
      console.log(id);
      location.href="./post.html?id=" + id;
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

        
