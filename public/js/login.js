

    'use strict';

    const loginForm = document.getElementById('login-form');
    


    const fetchGraphql = async (query) => {
      const apiURL = 'https://wisardster.jelastic.metropolia.fi/graphql';
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(query)
        };
        try {
            const response = await fetch(apiURL, options);
            //const response = await fetch('https://google.com', options);
            const json = await response.json();
            return json.data;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        
    };
    
    const login = async (evt) => {
        evt.preventDefault();
        const username = document.getElementById('login-form').elements['username'].value;
        const password = document.getElementById('login-form').elements['password'].value;
      
        const query = {
          query:`{
        login(username: "${username}" password: "${password}") {
          id
          username
          token
          }
        }`};
        
        try {
          const result = await fetchGraphql(query);
          console.log(result);
          localStorage.setItem('token', result.login.token);
          localStorage.setItem('userid', result.login.id);
          location.href="./chat.html";
        } catch (e) {
          console.log(e.message);
        }
        
    }
      
    loginForm.addEventListener('submit', login);

    