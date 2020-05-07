

    'use strict';

    const apiURL = 'https://wisardster.jelastic.metropolia.fi/graphql';

    const createPostBtn = document.getElementById('createPostBtn');


    window.onload = function() {
        'use strict';
        /*  
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
                   .register('./sw.js');
        }
        */
        //loadFeed();
        init();
        
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

    const init = async () => {
      const topicList = document.getElementById("listOfTopics");
      const queryTopics = `{
        topics {
          id
          title
        }
      }`;
      const options = await fetchGraphql(queryTopics);
      console.log("Topics", options);
      
      options.topics.forEach((type) => {
      let template = `<option value="${type.id}">${type.title}</option>`;

      $('#listOfTopics').append(Mustache.render(template, options));
      });
    }

    const createPost = async (e) => {
      e.preventDefault();
      /*
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      */

      const titleValue = document.getElementById("title").value;
      const textValue = document.getElementById("text").value;
      const mediaValue = document.getElementById("media").value;
      const dateCreatedValue = document.getElementById("dateCreated").value;
      const topicValue = document.getElementById("listOfTopics").value;

      const query = `mutation {
        addPost(user:"${localStorage.getItem('userid')}" title:"${titleValue}" topic:"${topicValue}" text:"${textValue}" media:"${mediaValue}" dateCreated:"${dateCreatedValue}") {
          id
        }
      }`;

      const data = await fetchGraphql(query);

      console.log('data returned:', data.addPost.id);
      location.href="./post.html?id=" + data.addPost.id;
        
        
      //console.log('posts', data.user.topics[0].posts);
        
      
    }

    
    createPostBtn.addEventListener('click', (e) => {
        createPost(e);
    })

        
