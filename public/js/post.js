

    'use strict';

    const apiURL = 'https://wisardster.jelastic.metropolia.fi/graphql';

    const feedButton = document.getElementById('feedBtn');
    const exploreButton = document.getElementById('exploreBtn');
    const profileButton = document.getElementById('profileBtn');
    const commentButton = document.getElementById('commentButton');
    const feed = document.getElementById('feed');
    const welcome = document.getElementById('welcome');
    const explore = document.getElementById('explore');
    const profile = document.getElementById('profile');
    const settings = document.getElementById('settings');
    let userData = {};

    const feedLabel = document.getElementById('titleLabel');
    const userLabel = document.getElementById('userLabel');
    const textLabel = document.getElementById('textLabel');
    const commentSection = document.getElementById('commentSection');

    window.onload = function() {
        'use strict';
        /*  
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
                   .register('./sw.js');
        }
        */
        loadPost();
        
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

    const loadPost = async (e) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');

        const query = `{
          post(id:"${id}") {
            title
            text
            user {
              username
            }
            comments {
              user {
                username
              }
              text
            }
          }
        }`;

        const data = await fetchGraphql(query);

        console.log('data returned:', data)
        feedLabel.innerHTML = `<h3>${data.post.title}</h3>`;
        userLabel.innerHTML = `<p>Poster: ${data.post.user.username}</p>`;
        textLabel.innerHTML = `<p>${data.post.text}</p>`;


        if (data.post.comments.length < 1) {
          commentSection.innerHTML = `<div id="commentSection">
          <h6>Comments</h6>
          <div class="card">
            <p id="titleLabel" class="card-text">It's quiet here...</p>
          </div>
        </div>`
        } else {
          $.each(data.post.comments, function(index, item) {
              console.log(item);
              let template = `<div class="card" style="width: 95%; margin: auto;">
              <div class="card-body">
              <p style="margin:1px;"><em>User: {{ user.username }}</em></p>
              <h5 class="card-title"></h5>
              <p class="card-text">{{ text }}</p>
              
              </div>
              </div>
              <br>`;
              $('#commentSection').append(Mustache.render(template, item));
          });
        }
        //console.log('posts', data.user.topics[0].posts);
        
      
    }

    const addComment = async (e) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      const text = document.getElementById('commentText').value;

      const query = `mutation {
        addComment(user:"${localStorage.getItem('userid')}" post:"${id}" text:"${text}") {
          id
        }
      }`;
      const data = await fetchGraphql(query);
      console.log(data);
      location.href="./post.html?id=" + id;

    }

    const readPost = async (id) => {
      console.log(id);
      location.href="./post/id:" + id;
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

    commentButton.addEventListener('click', (e) => {
      console.log("hey");
        addComment(e);
    })

    feedButton.addEventListener('click', (e) => {
        loadPost(e);
    })
    exploreButton.addEventListener('click', (e) => {
        loadExplore(e);
    })

        
