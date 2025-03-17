import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegThumbsUp,
  FaRegComment,
  FaRetweet,
  FaPaperPlane,
  FaUserPlus,
  FaIndustry,
  FaTrashAlt,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [showMore, setshowMore] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [postStates, setPostStates] = useState({});
  const [command, setCommand] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedcmd, setSelectedcmd] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("email");
    if (!loggedInUser) {
      navigate("/");
    }
  }, [navigate]);
  const ReadMore = () => {
    setshowMore(!showMore);
    console.log("showmore state", !showMore);
  };
  //display profile on home page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("token null");
      return;
    }
    fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);
  //display post
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      //const token="hello";
      if (!token) {
        console.log("token null");
        return;
      }
      const response = await fetch("http://localhost:5000/getposts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("token", token);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  //new post
  const handlePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token null");
        return;
      }
      if (!postContent.trim() && !imageUrl.trim()) {
        alert("Please enter content or an image URL");
        return;
      }
      const postData = {
        userId: profile.usermail,
        content: postContent,
        image: imageUrl,
        first: profile.fname,
        last: profile.lname,
        edu: profile.education,
        imgs: profile.image_url,
      };

      const response = await fetch("http://localhost:5000/createposts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log("result", result);
      if (response.ok) {
        setPostContent("");
        setImageUrl("");
        setModalOpen(false);
        fetchPosts();
      } else {
        alert(posts.message);
      }
    } catch (error) {
      console.error("Error on new post", error);
    }
  };
  if (!profile) {
    return <p>Loading profile...</p>;
  }
  //command delete
  const cmddelete = (cmdId) => {
    setSelectedcmd(cmdId);
  };
  const delcomd = async () => {
    if (!selectedcmd) {
      alert("Cant get id for delete!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/commanddelete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedcmd),
      });

      const updatedPost = await response.json();
      if (response.ok) {
        fetchPosts();
        alert("deleted successfully!");
        setSelectedcmd("");
      } else {
        console.log("Error on delete command:", updatedPost.message);
      }
    } catch (error) {
      console.error("Error delete command:", error);
    }
  };
  //command
  const handleid = (postId) => {
    setSelectedPostId(postId);
  };
  const addCommand = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token null");
        return;
      }
      if (!command.trim()) {
        alert("Command cannot be empty!");
        return;
      }
      // if (!selectedPostId) {
      //   alert("No post selected!");
      //   return;
      // }
      const commanddata = {
        command: command,
        postId: selectedPostId,
      };
      const response = await fetch("http://localhost:5000/command", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commanddata),
      });

      const updatedPost = await response.json();
      if (response.ok) {
        fetchPosts();
        setCommand("");
      } else {
        console.log("Error adding command:", updatedPost.message);
      }
    } catch (error) {
      console.error("Error adding command:", error);
    }
  };
  //like,command,report,follow
  const handleLike = (postId) => {
    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        likes: (prevState[postId]?.likes || 0) + 1,
      },
    }));
  };

  const handleComment = (postId) => {
    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        comments: (prevState[postId]?.comments || 0) + 1,
        showComments: !prevState[postId]?.showComments,
      },
    }));
  };
  const handleFollow = (postId) => {
    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        isFollowing: !prevState[postId]?.isFollowing,
      },
    }));
  };

  return (
    <div className="container">
      <div className="body-container">
        <div class="left-sidebar">
          <div class="profile-card">
            <img src={profile.image_url} alt="Profile" class="profile-pics" />
            <h3>
              {profile.fname} {profile.lname}
            </h3>
            <p>{profile.headline}</p>

            <p class="location">{profile.location}</p>
          </div>

          <div class="stats">
            <p>
              Profile viewers <span class="count">18</span>
            </p>
            <p>
              Post impressions <span class="count">20</span>
            </p>
          </div>

          <div class="premium">
            <p>Network smarter with Premium</p>
            <p FaStar className="pre">
              Try 1 month of Premium for ₹0
            </p>
          </div>

          <div class="quick-links">
            <p>🔖 Saved items</p>
            <p>👥 Groups</p>
            <p>📩 Newsletters</p>
            <p>📅 Events</p>
          </div>
        </div>

        {/* Main Feed */}
        <div className="feed-container">
          <div className="main-feed">
            <div className="post-box">
              <img
                className="profile-pic"
                src={profile.image_url}
                alt="Profile"
              />
              <button
                type="text"
                placeholder="Start a post..."
                onClick={() => setModalOpen(true)}
              >
                Start a post
              </button>
            </div>

            {/* Buttons Section */}
            <div className="post-options">
              <button>📷 Media</button>
              <button>📅 Event</button>
              <button>✍️ Write Article</button>
            </div>
          </div>
          <div className="action-buttons">
            <button className="add">➕ Add</button>
            <button>✔️ Following</button>
          </div>
          {/* post */}
          {ModalOpen && (
            <div className="modal-overlay" onClick={() => setModalOpen(false)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-btn"
                  onClick={() => setModalOpen(false)}
                >
                  ✖
                </button>
                <h2>Create a Post</h2>
                <img
                  className="pop-profile"
                  src={profile.image_url}
                  alt="User"
                />
                <div>
                  <h3 className="popname">
                    {profile.fname} {profile.lname}{" "}
                  </h3>
                  <p className="popedu">{profile.education}</p>
                </div>
                <textarea
                  placeholder="What do you want to talk about?..."
                  rows="10"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
                Image URL for post :
                <input
                  className="popinput"
                  type="text"
                  placeholder="Enter image-url..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <button className="post-btnnn" onClick={handlePost}>
                  Send
                </button>
              </div>
            </div>
          )}
          {console.log("post", posts)}
          {
            posts?.map((post, i) => (
              <div key={i} className="post">
                <div className="post-header">
                  <img className="post-profile" src={post.imgs} alt="User" />
                  <div>
                    <h3 className="postname">
                      {post.first} {post.last}{" "}
                    </h3>
                    <p className="postedu">{post.edu}</p>
                  </div>
                  <div className="follow-div">
                    <button
                      className={`follow-btn ${
                        postStates[post._id]?.isFollowing ? "following" : ""
                      }`}
                      onClick={() => handleFollow(post._id)}
                    >
                      <FaUserPlus />{" "}
                      {postStates[post._id]?.isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                  </div>
                </div>
                <p className="post-centent">{post.content}</p>
                <img className="post-img" src={post.image} alt="Post Image" />
                <div className="comment-divider"></div> {/* Horizontal Line */}
                <div className="post-btn">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="post-icon"
                  >
                    <FaRegThumbsUp /> Like ({postStates[post._id]?.likes || 0})
                  </button>
                  <button
                    onClick={() => handleComment(post._id)}
                    className="post-icon"
                  >
                    <FaRegComment /> Comment
                    {/* ({postStates[post._id]?.comments || 0}) */}
                  </button>
                  <button className="post-icon">
                    <FaRetweet /> Repost
                  </button>
                  <button className="post-icon">
                    <FaPaperPlane /> Send
                  </button>
                </div>
                {/* command section */}
                {postStates[post._id]?.showComments && (
                  <div className="comment-section">
                    <img
                      className="postf-profile"
                      src={profile.image_url}
                      alt="User"
                    />
                    <p className="cmd-name">
                      {profile.fname}
                      {profile.lname}
                    </p>
                    <p className="cmd-edu">{profile.education}</p>
                    <input
                      placeholder="Add a comment..."
                      className="comment-input"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                    ></input>
                    <button
                      className="comment-submit"
                      onClick={() => {
                        handleid(post._id);
                        addCommand();
                      }}
                    >
                      Post
                    </button>
                    {Array.isArray(post.command) ? (
                      <div className="commands-list">
                        {post.command.map((cmd, index) => (
                          <div className="delete">
                            <p key={index} className="command-item">
                              <img
                                className="posts-profile"
                                src={profile.image_url}
                                alt="User"
                              />
                              {cmd}
                            </p>
                            <button
                              className="delete-btn"
                              onClick={() => {
                                cmddelete(post._id);
                                delcomd();
                              }}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No commands available</p>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Right Sidebar */}
        <div className="right">
          <div className="right-sidebar">
            <h3>Trending Now</h3>
            <h6>Nasdaq plans for 24-hour trading</h6>
            <p>2d ago • 42,058 readers</p>
            <h6>India wins ICC Champions Trophy</h6>
            <p>12hrs ago • 69,999 readers</p>
            <h6>What Indian employees want</h6>
            <p>3days ago • 4058 readers</p>
            <h6>Manufacturing activity slows</h6>
            <p>5days ago • 3158 readers</p>
            <h6>Healthcare gets AI savvy</h6>
            <p>6days ago • 3038 readers</p>
            <h6>India’s GDP to remain stable</h6>
            <p>6days ago • 8038 readers</p>
            {showMore && (
              <div className="more-trending">
                <h6>Stock market slump hits FMCG sales</h6>
                <p>7days ago • 11,038 readers</p>
                <h6>Indian founders pivot to new ventures</h6>
                <p>7days ago • 7038 readers</p>
              </div>
            )}
            <button className="read-more-btn" onClick={ReadMore}>
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>
          <div className="trys">
            <FaIndustry />
            Try CareerNexus in windows app
          </div>
          <div className="about">
            <p>
              About Accessibility Help Center Privacy & Terms Ad Choices
              Advertising Business Services Get the LinkedIn app More LinkedIn
              Corporation © 2025
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
        .body-container {
            display: grid;
            grid-template-columns: 0.8fr 2fr 1fr;
            gap: 20px;
            max-width: 1128px;
            margin:60px auto;
            padding:30px;
            align-items:start;
          }

.left-sidebar {
  padding: 0px;
  border-radius: 8px;
  hight:100px;
  width:230px;
  padding-left:2px;
 display: grid;
gap: 7px;
position: sticky;
}
.profile-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-pics {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

h3 {
  font-size: 17px;
  margin-bottom: 5px;
}

.location {
  font-size: 12px;
  color: gray;
}


.stats {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(170, 19, 19, 0.05);
}

.stats p {
  display: flex;
  justify-content: space-between;
  font-weight:bold;
  font-size: 13px;
  margin: 5px 0;
}
.count{
color:blue;
}
.premium {
  background: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: gray;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.pre {
 color:black;
 font-size: 12px;
  font-weight:bold;
  border: none;
  padding: 2px 1px;
  border-radius: 5px;
  cursor: pointer;
}


.quick-links {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
}

.quick-links p {
  font-size: 15px;
  padding: 5px 0;
  cursor: pointer;
  font-weight:bold;
}

.quick-links p:hover {
  color: #0073b1;
}
.feed-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 90%;
  max-width: 800px;
  padding-left:28px;
}

.main-feed {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
}


.post-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  
}

.profile-pic {
  width: 75px;
  height: 70px;
  border-radius: 50%;
}
.post-profile{
 width: 60px;
  height: 70px;
  border-radius: 50%;
}
.postedu{
font-size: 15px;
margin-top:5px;
color:rgb(139, 138, 132);
} 
.postname{
font-size: 15px;

} 
.pop-profile{
 width: 60px;
  height: 70px;
  border-radius: 50%;
  
}
.popedu{
font-size: 15px;
margin-top:5px;
margin-left:10%;
color:rgb(139, 138, 132);
} 
.popname{
font-size: 15px;
margin-top:-8%;
margin-left:10%;
} 
.popinput{
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
  background-color: #f3f2ef;
}
.post-box button {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: #f3f2ef;
  color:rgb(104, 103, 100);
  
}


.post-options {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}

.post-options button {
  border: none;
  background: none;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  color:black;
}


.post-options button:hover {
  background: #f3f2ef;
  border-radius: 5px;
}


.action-buttons {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  justify-content: flex-start;
}

.action-buttons button {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: #f3f2ef;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
}
  .action-buttons button:hover {
  background: #e1e1e1;
}
  .add {
  background:green;
  }

  .post{
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}
  .post-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
  .follow-div{
  padding-left:17%;
  }
  .follow-btn {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
}

.following {
  background-color: #ccc;
  color: black;
}

.post-img{
  max-width: 500px;
}
  .post-btn {
  display: flex;
 align-items: center;
  gap: 43px;
  margin-top: 8px;
}

.post-btn button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  color: black;
  font-weight: bold;
}
  /* Modal Overlay (background) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
}
  .modal-content {
  background: #ffffff;
  padding: 25px;
  border-radius: 50px;
  width: 50%;
  max-height: 80vh;;
  position: relative;
  box-shadow: 0px 4px 10px rgba(241, 237, 241, 0.2);
  animation: fadeIn 0.5s ease-in-out;
   overflow-y: auto; 
  scrollbar-width: none;
}
  .modal-content::-webkit-scrollbar {
  display: none;
}
.close-btn {
  position: absolute;
  top: 40px;
  right: 25px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
  .post-btnnn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 50%;
  margin-top: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

  textarea {
  width: 100%; 
  min-height: 150px; 
  font-size: 15px;
  padding: 10px; 
  border: none; 
  resize: none;
  outline: none; 
  background-color: transparent; 
}

textarea:focus {
  border-bottom: 2px solidrgb(26, 27, 28); /* Blue underline on focus */
}

/* Animation for Modal */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

//commend
.comment-divider {
  border: none;
  height: 1px;
  background-color: #222;
  margin: 15px 0;
}
.comment-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.postf-profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  margin-top:5px;
}

.cmd-name {
  font-weight: bold;
  font-size:13px;
  color: #333;
  margin-top: -40px;
  margin-left:50px;
}

.cmd-edu {
  font-size: 12px;
  color: #777;
  margin-bottom: 5px;
  margin-top: -10px;
  margin-left:50px;
}

.commands-list {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  
}

.command-item {
  background: #f2f2f2;
  border-radius: 15px;
  padding: 8px 12px;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.posts-profile {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-top: 10px;
  margin-right:10px;
}

.comment-submit {
  background: #0a66c2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 5px;
}

.comment-submit:hover {
  background: #004182;
}
  
.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color:rgb(106, 101, 101);
  font-size: 13px;
  transition: transform 0.2s ease;
  margin-top:-35px;
  float:right;
}

.delete-btn:hover {
  color:rgb(41, 38, 39);
  transform: scale(1.1);
}
  .right{
   border-radius: 8px;
  padding: 15px;
  display: grid;
  gap: 7px;
  padding: 0px;
  }
.right-sidebar {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;

}

.right-sidebar h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.right-sidebar h6 {
  font-size: 15px;
  font-weight: bold;
  color: #0073b1;
  margin: 10px 0 3px;
  cursor: pointer;
  transition: color 0.3s;
}

.right-sidebar h6:hover {
  color: #005582;
  text-decoration: underline;
}

.right-sidebar p {
  font-size: 13px;
  color: gray;
  margin-bottom: 12px;
}
  .more-trending {
  display: block;
  transition: all 0.3s ease-in-out;
}

.read-more-btn {
  background: none;
  border: none;
  color: #0073b1;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.read-more-btn:hover {
  text-decoration: underline;
}
  .trys{
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(170, 19, 19, 0.05);
  display: flex;
  gap:10px;
  justify-content: space-around;
  color:gray;
  font-weight: bold;
}
  
.about {
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 1.5;
    max-width: 250px;
    margin: auto;
    display: flex;
    gap: 12px;
}

.about p {
    margin: 0;
    padding: 5px;
}

       `}
      </style>
    </div>
  );
};

export default Home;
