document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("postId");

  loadPost();

  // ===============================
  // 🔹 TOAST FUNCTION (toast1)
  // ===============================
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("success", "error");
    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // ===============================
  // 🔹 LOAD POST
  // ===============================
  async function loadPost() {

    if (!postId) return;

    try {

      const postRes = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      const post = await postRes.json();

      const userRes = await fetch(
        `https://jsonplaceholder.typicode.com/users/${post.userId}`
      );
      const user = await userRes.json();

      const commentsRes = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const comments = await commentsRes.json();

      const morePostsRes = await fetch(
        `https://jsonplaceholder.typicode.com/users/${post.userId}/posts`
      );
      const morePosts = await morePostsRes.json();


      // ===============================
      // SET MAIN POST DETAILS
      // ===============================

      document.getElementById("post-avatar").src =
        `https://i.pravatar.cc/150?img=${post.userId}`;

      document.getElementById("post-title").textContent = post.title;
      document.getElementById("post-body").textContent = post.body;
      document.getElementById("post-author").textContent = user.name;
      document.getElementById("post-username").textContent =
        "@" + user.username.toLowerCase();


      // ===============================
      // MAIN POST LIKE SYSTEM (SVG RED)
      // ===============================

      const likeBtn = document.querySelector(".like-button");
const likeCountEl = document.querySelector(".like-count");

let likeCount = Math.floor(Math.random() * 200);
let liked = false;

likeCountEl.textContent = likeCount;

likeBtn.addEventListener("click", () => {

  liked = !liked;

  if (liked) {
    likeCount++;
    likeBtn.classList.add("liked");


    showToast("✅ Post liked successfully", "success");

  } else {
    likeCount--;
    likeBtn.classList.remove("liked");

    
    showToast("❌ Like removed", "error");
  }

  likeCountEl.textContent = likeCount;
});


  

      document.querySelector(".share-button")
        .addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            showToast("Link copied to clipboard ✅", "success");
          } catch {
            showToast("Failed to copy link ❌", "error");
          }
        });


     
      const bookmarkBtn = document.querySelector(".bookmark-button");
      const postCard = document.querySelector(".one-post1");

      let bookmarked = false;

      bookmarkBtn.addEventListener("click", () => {

        bookmarked = !bookmarked;

        if (bookmarked) {
          postCard.classList.add("bookmarked");
          showToast("Post saved to bookmarks 📌", "success");
        } else {
          postCard.classList.remove("bookmarked");
          showToast("Bookmark removed ❌", "error");
        }

      });



      const commentsContainer = document.getElementById("comments-container");
      const commentsCount = document.getElementById("comments-count");
      const commentCountBtn = document.querySelector(".comment-count");

      commentsContainer.innerHTML = "";

      comments.forEach(comment => {
        const div = document.createElement("div");
        div.classList.add("individual-comments");

        div.innerHTML = `
          <div class="comment-card-image">
            <p>${comment.email.charAt(0).toUpperCase()}</p>
          </div>
          <div class="name-and-body">
            <div class="name-and-email-id">
              <h4>${comment.name}</h4>
              <p>${comment.email}</p>
            </div>
            <div>
              <p>${comment.body.replace(/\n/g, "<br>")}</p>
            </div>
          </div>
        `;

        commentsContainer.appendChild(div);
      });

      commentsCount.textContent = `(${comments.length})`;
      commentCountBtn.textContent = comments.length;


    

     const form = document.getElementById("comments-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const commentText = document.getElementById("comment").value.trim();

  // Prevent empty submission
  if (!name || !email || !commentText) {
    showToast("Please fill all fields ❌", "error");
    return;
  }

  const div = document.createElement("div");
  div.classList.add("individual-comments");

  div.innerHTML = `
    <div class="comment-card-image">
      <p>${email.charAt(0).toUpperCase()}</p>
    </div>
    <div class="name-and-body">
      <div class="name-and-email-id">
        <h4>${name}</h4>
        <p>${email}</p>
      </div>
      <div>
        <p>${commentText}</p>
      </div>
    </div>
  `;

  // Add new comment at top
  commentsContainer.prepend(div);

  // 🔥 Update comment count properly
  const newCount = commentsContainer.children.length;

  commentsCount.textContent = `(${newCount})`;
  commentCountBtn.textContent = newCount;

  // ✅ Show success toast
  showToast("Comment posted successfully ✅", "success");

  form.reset();
});


    
      const moreContainer = document.getElementById("more-posts-container");
      moreContainer.innerHTML = "";

      const filteredPosts = morePosts.filter(p => p.id != postId);

      filteredPosts.slice(0, 3).forEach(p => {

        const likes = Math.floor(Math.random() * 200);
        const commentsRandom = Math.floor(Math.random() * 50);

        const div = document.createElement("div");
        div.classList.add("one-post1");

        div.innerHTML = `
          <div class="dp-and-name">
            <img class="dp" src="https://i.pravatar.cc/150?img=${post.userId}">
            <div>
              <h4>${user.name}</h4>
              <p>@${user.username.toLowerCase()}</p>
            </div>
          </div>

          <div class="post-title">
            <a href="back-to-feed.html?postId=${p.id}">
              ${p.title}
            </a>
          </div>

          <div class="post-body">
            <p>${p.body.substring(0, 120)}...</p>
          </div>

          <div class="post-card-actions">

            <button class="action-btn like-btn">
              <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg"
                width="18" height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
              </svg>
              <span class="like-number">${likes}</span>
            </button>

            <button class="action-btn">
              💬 ${commentsRandom}
            </button>
          <!-- BOOKMARK BUTTON -->
    <button class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg"
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

  </div>

  <div class="post-readmore">
    <a href="back-to-feed.html?postId=${p.id}">
      Read More
    </a>
  </div>

          </div>
        `;

        moreContainer.appendChild(div);

        // Like toggle for each card
        const likeBtnCard = div.querySelector(".like-btn");
        const likeNumber = div.querySelector(".like-number");

        let likedCard = false;
        let countCard = likes;

        likeBtnCard.addEventListener("click", () => {

          likedCard = !likedCard;

          if (likedCard) {
            countCard++;
            likeBtnCard.classList.add("liked");
          } else {
            countCard--;
            likeBtnCard.classList.remove("liked");
          }

          likeNumber.textContent = countCard;
        });

      });

    } catch (error) {
      console.error("Error loading post:", error);
    }
  }

});