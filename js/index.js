document.addEventListener("DOMContentLoaded", () => {
      const form = document.querySelector("#github-form");
      const searchInput = document.querySelector("#search");
      const userList = document.querySelector("#user-list");
      const reposList = document.querySelector("#repos-list");
      const toggleSearchButton = document.createElement('button');
      toggleSearchButton.textContent = "Search Repos";
      document.querySelector('#main').appendChild(toggleSearchButton);
    
      let searchType = 'user'; // Default to searching for users
    
      // Event listener to handle form submission
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value;
    
        if (searchType === 'user') {
          searchUsers(query);
        } else if (searchType === 'repo') {
          searchRepos(query);
        }
      });
    
      // Toggle search type between 'user' and 'repo'
      toggleSearchButton.addEventListener("click", () => {
        searchType = searchType === 'user' ? 'repo' : 'user';
        toggleSearchButton.textContent = searchType === 'user' ? 'Search Repos' : 'Search Users';
      });
    
      // Function to search GitHub users
      function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
          headers: {
            Accept: "application/vnd.github.v3+json"
          }
        })
          .then(response => response.json())
          .then(data => {
            userList.innerHTML = ''; // Clear previous results
            data.items.forEach(user => {
              const userItem = document.createElement('li');
              userItem.innerHTML = `
                  <a href="${user.html_url}" target="_blank">
                  <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50"/>
                  ${user.login}
                </a>
              `;
              userItem.addEventListener("click", () => showRepos(user.login));
              userList.appendChild(userItem);
            });
          })
          .catch(error => console.error('Error fetching users:', error));
      }
    
      // Function to search GitHub repositories
      function searchRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
          headers: {
            Accept: "application/vnd.github.v3+json"
          }
        })
          .then(response => response.json())
          .then(data => {
            reposList.innerHTML = ''; // Clear previous results
            data.items.forEach(repo => {
              const repoItem = document.createElement('li');
              repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">
                 ${repo.name}
                </a>
                <p>⭐ ${repo.stargazers_count} stars</p>
              `;
              reposList.appendChild(repoItem);
            });
          })
          .catch(error => console.error('Error fetching repositories:', error));
      }
    
      // Function to display repositories of a user
      function showRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            Accept: "application/vnd.github.v3+json"
          }
        })
          .then(response => response.json())
          .then(repos => {
            reposList.innerHTML = ''; // Clear previous results
            repos.forEach(repo => {
              const repoItem = document.createElement('li');
              repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">
                 ${repo.name}
                </a>
                <p>⭐ ${repo.stargazers_count} stars</p>
              `;
              reposList.appendChild(repoItem);
            });
          })
          .catch(error => console.error('Error fetching user repos:', error));
      }
    });
