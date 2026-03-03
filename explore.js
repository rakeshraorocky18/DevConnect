const userContainer = document.getElementById("user-container");
const footer = document.getElementById("footer");
const searchInput = document.getElementById("search-input");

footer.style.display = "none";

let allUsers = []; // store users globally

// redirect to profile page
function viewProfile(id) {
  window.location.href = `profile.html?id=${id}`;
}

// Load users initially
async function loadUsers() {
  try {

    const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await usersRes.json();

    allUsers = users; // save for search

    await displayUsers(users);

    footer.style.display = "block";

  } catch (error) {
    console.error("Error loading users:", error);
  }
}

// Display users function (reusable for search)
async function displayUsers(users) {

  userContainer.innerHTML = "";

  for (let user of users) {

    const postsRes = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
    );
    const posts = await postsRes.json();

    const avatar = `https://i.pravatar.cc/150?img=${user.id}`;

    const userCard = document.createElement("div");
    userCard.classList.add("user-details");

    userCard.innerHTML = `
        <div class="user-top-color"></div>

        <div class="users-photo">
            <img class="user-photo" src="${avatar}" alt="User Image">
        </div>

        <div class="user-information">
            <h3>${user.name}</h3>
            <p>@${user.username.toLowerCase()}</p>
            <p>${user.company.name}</p>

            <div class="user-data">
                <span class="user-posts">
                    <strong>${posts.length}</strong> Posts
                </span>

                <span class="user-posts">
                    <strong>${Math.floor(Math.random() * 5000)}</strong> Followers
                </span>
            </div>
        </div>

        <div class="view-profile-btn">
            <button class="view-profile" onclick="viewProfile(${user.id})">
                View Profile
            </button>
        </div>
    `;

    userContainer.appendChild(userCard);
  }
}

// 🔍 SEARCH FILTER
searchInput.addEventListener("input", async function () {

  const value = searchInput.value.toLowerCase();

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(value) ||
    user.username.toLowerCase().includes(value)
  );

  await displayUsers(filteredUsers);
});

loadUsers();