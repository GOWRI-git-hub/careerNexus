import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [showMore, setshowMore] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    pronouns: "",
    headline: "",
    education: "",
    location: "",
    image_url: "",
  });
  const ReadMore = () => {
    setshowMore(!showMore);
    console.log("showmore state", !showMore);
  };

  //display profile on profile page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token is null");
      navigate("/");
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
        setFormData({
          id: data.id || "",
          firstname: data.fname || "",
          lastname: data.lname || "",
          pronouns: data.pronouns || "",
          headline: data.headline || "",
          education: data.education || "",
          location: data.location || "",
          image_url: data.image_url || "",
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token is null");
      return;
    }
    fetch("http://localhost:5000/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setModalOpen(false);
        window.location.reload();
      })
      .catch((error) => console.error("Error updating profile:", error));
  };
  //display post
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token is null");
        return;
      }
      const response = await fetch("http://localhost:5000/profilepost", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  //delete post

  const deleted = async (delpost) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token is null");
        return;
      }
      const response = await fetch("http://localhost:5000/deletepost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: delpost }),
      });

      const updatedPost = await response.json();
      if (response.ok) {
        if (
          window.confirm("Delete post successfully! Do you want to continue?")
        ) {
          fetchPosts();
        } else {
          console.log("User canceled the action.");
        }
      } else {
        console.log("Error while delete:", updatedPost.message);
      }
    } catch (error) {
      console.error("Error on delete:", error);
    }
  };
  if (!profile) {
    return <p>Loading profile...</p>;
  }
  return (
    <div className="body">
      <div className="container">
        {/* Left Section */}

        <div className="left">
          <div className="background-cover"></div>
          <div className="profile-header">
            <img
              src={profile.image_url || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
            <div className="edit-icon" onClick={handleEditClick}>
              <FaEdit />
            </div>
            <h1>
              {profile.fname} {profile.lname} <span>({profile.pronouns})</span>
            </h1>
            <p>{profile.headline}</p>
            <p>
              <strong>Education:</strong> {profile.education}
            </p>
            <p>
              <strong>Location:</strong> {profile.location}
            </p>

            <p className="profile-stats"> {profile.connections}:Connections</p>
          </div>
          {/* Buttons Section */}
          <div className="profile-buttons">
            <button className="blue-button">Open to</button>
            <button className="white-button">Add profile section</button>
            <button className="white-button">Enhance profile</button>
            <button className="black-button">Resources</button>
          </div>
        </div>

        {ModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Edit Profile</h2>
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}
        <div className="profile-post">
          {
            posts?.map((post, i) => (
              <div key={i} className="post">
                <div className="post-header">
                  <img className="post-profile" src={post.imgs} alt="User" />
                  <div>
                    <h3 className="postname">{post.first} </h3>
                    <p className="postedu">{post.edu}</p>
                  </div>
                  <div className="follow-div">
                    <button
                      className="follow-btn"
                      onClick={() => {
                        deleted(post._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="post-centent">{post.content}</p>
                <img className="post-img" src={post.image} alt="Post Image" />
              </div>
            ))}
        </div>
        {/* Right Section */}
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
        </div>
      </div>

      {/* CSS Styling */}
      <style>
        {`
          .body{
            background-color: #f3f2ef;
            height: 100vh;
            display: grid;
            grid-template-columns: 3fr 1fr ;
            gap: 20px;
            max-width: 1128px;
            margin:60px auto;
            padding:30px;
            align-items:start;
          }
       
          .container{
          padding: 0px;
          border-radius: 8px;
          padding-left:2px;
          display: grid;
          gap: 20px;
          
          }
          .left {
          background: white;
          border-radius: 12px;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
        }
        
        .background-cover {
          width: 100%;
          height: 190px;
          background: linear-gradient(to right, #bccad6, #8faac9);
          position: absolute;
          top: 0;
          left: 0;
        }

        /* Profile Header */
        .profile-header {
          padding: 90px;
          position: relative;
          padding-left:30px;
        }

        .profile-image {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border: 4px solid white;
          object-fit: cover;
          position: relative;
          top: -20px;
          background: white;
        }
        .edit-icon {
  position: absolute;
  top: 210px; 
  right: 20px;
  font-size: 25px;
  color: #333;
  cursor: pointer;
}

.edit-icon:hover {
  color: #0a66c2;
}
        h1 {
          font-size: 20px;
          margin: -5px 0;
          color: #333;
        }

        .profile-header p {
          color: #666;
          font-size: 14px;
          margin: 4px 0;
        }

        .profile-stats {
        color:rgb(18, 21, 188);
        font-size: 14px;
        font-weight:bold;
        }

        .profile-buttons {
          display: flex;
          gap: 10px;
         padding-bottom: 20px;
         margin-top:-10%;
        }

       .blue-button {
          margin-left:20px;
          background-color:rgb(6, 92, 178);
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 20px;
          cursor: pointer;
          width:15%;
          position: relative;
        }

        .white-button {
          background-color: white;
          color: #0a66c2;
          border: 2px solid #0a66c2;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 20px;
          cursor: pointer;
          width:20%;
          position: relative;
        }
           .black-button {
          background-color: white;
          color:rgb(10, 13, 16);
          border: 2px solid #0a66c2;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 20px;
          cursor: pointer;
          position: relative; 
           width:20%;
        }

        .blue-button:hover {
          background-color:rgb(3, 58, 112) !important;
        }

        .white-button:hover {
          background-color: #ebf3ff !important;
          border: 2px solid rgb(8, 91, 174) !important;
        }
          .black-button:hover {
          background-color: #ebf3ff !important;
          border: 2px solid rgb(20, 20, 21) !important;
        }
        
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); 
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  z-index: 9999;
  
}


.modal-content {
  background: #ffffff;
  padding: 50px;
  border-radius: 50px;
  width: 500px;
  max-height: 500px;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
   overflow-y: auto; 
  scrollbar-width: none;
}
  .modal-content::-webkit-scrollbar {
  display: none;
}
 .modal-content label {
  font-size: 15px;
  font-weight: 600;
  color: rgb(9, 9, 9);
  margin-bottom: 4px;
  text-transform: capitalize;
}
.close {
  position: absolute;
  top: 60px;
  right: 40px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  color: #555;
  transition: color 0.5s ease;

}

.close:hover {
  color: #ff4d4d;
}


.modal-content input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.5s ease-in-out;
}

.modal-content input:focus {
  border-color:rgb(96, 20, 16);
  outline: none;
}

.save-button {
  align-Item:center;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.5s ease-in-out;
  width: 100%;
  margin-top: 10px;
}

.save-button:hover {
  background: #0056b3;
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
  
  .profile-post {
  display: flex;
  flex-direction: row;
  max-width: 900px;
  gap: 18px;
  max-height: 400px;
  overflow-x: auto;
  overflow-y: auto;
  scroll-behavior: smooth; 
  padding-bottom: 20px; 
  background-color:white;
  padding:20px;
  border-radius:15px;
  
}


.profile-post::-webkit-scrollbar {
  height: 8px; /* Height of the scrollbar */
  width: 8px; 
}

.profile-post::-webkit-scrollbar-thumb {
  background: #ccc; 
  border-radius: 24px; 
}
  
  .profile-post::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

.profile-post::-webkit-scrollbar-thumb:hover {
  background: #aaa; 
}

 .post{
  background:rgba(231, 230, 226, 0.82);7;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  height:760px;
  margin-top:10px;
  margin-left:10px;
 }
  .post-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.post-profile{
 width: 60px;
  height: 60px;
  border-radius: 50%;
}
.postname{
font-size: 15px;
} 
.postedu{
font-size: 15px;
margin-top:-15px;
color:rgb(139, 138, 132);
} 
.post-img{
  max-width: 300px;
}
  .follow-div{
  margin-top:-30px;
  padding-left:5%;
  }
  .follow-btn {
  background-color:rgb(95, 99, 100);
  color: white;
  border: none;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
}
 .right{
   border-radius: 8px;
  padding: 15px;
  display: grid;
  gap: 7px;
  padding: 0px;
  margin-bottom:40px;
  }
.right-sidebar {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  margin-top: -112%; 
  margin-left:103%;
  width: 300px;
  max-height:550px;
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
      `}
      </style>
    </div>
  );
};

export default Profile;
