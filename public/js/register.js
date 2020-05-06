

    'use strict';

    const registerForm = document.getElementById('register-form');
    


    const fetchGraphql = async (query) => {
      const apiURL = 'https://localhost:8000/graphql';
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
    
    const register = async (evt) => {
        evt.preventDefault();
        const fullname = document.getElementById('register-form').elements['fullname'].value;
        const username = document.getElementById('register-form').elements['username'].value;
        const password = document.getElementById('register-form').elements['password'].value;

        console.log(fullname);
        console.log(username);
        console.log(password);

      
        const query = {
          query:`mutation {
            addUser(username:"${username}" password:"${password}" fullName:"${fullname}" dateCreated:"123" isAdmin:false) {
              id
              username
            }
          }`};
        
        try {
          const result = await fetchGraphql(query);
          console.log(result);
          location.href="./login.html";
        } catch (e) {
          console.log(e.message);
        }
        
    }
      
    registerForm.addEventListener('submit', register);

    