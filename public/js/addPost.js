

    'use strict';

    const apiURL = 'https://localhost:8000/graphql';

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

    const createPost = async (e) => {
      e.preventDefault();
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      const titleValue = document.getElementById("title").value;
      const textValue = document.getElementById("text").value;
      const mediaValue = document.getElementById("media").value;
      const dateCreatedValue = document.getElementById("dateCreated").value;
      const topicValue = document.getElementById("topic").value;

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

        
