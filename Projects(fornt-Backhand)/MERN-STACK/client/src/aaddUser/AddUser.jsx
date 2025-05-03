import "./addUser.css";
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';

import { toast } from "react-hot-toast";


const AddUser = () => {
   const users = {
    name: "",
    email: "",
    address: ""
   };
   const [user, setUser] = useState(users);
    const navigate = useNavigate();

   const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name , value);

    setUser({ ...user, [name]: value });
   }; 
   const submitForm = async (e) => {  
           e.preventDefault();
           await axios.post("http://localhost:8000/api/user",user)
           .then((response)=>{
            // console.log("User added successfully");
            toast.success(response.data.massage,{ position:"top-right" });
            navigate("/");
           }) 
           .catch((error)=>{
            console.log("Error while adding user", error);
           }); 
          };             

  return (
    <div className="addUser">
      <Link to="/" type="button" class="btn btn-secondary"><i 
      class="fa-solid fa-backward"></i> Back</Link>
      <h3>Add New User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input 
          type="text" 
          id="name" 
          name="name"
          onChange={inputHandler}
          placeholder="Enter your name" 
          autoComplete='off'/>
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input 
          type="text" 
          id="email" 
          name="email"
          onChange={inputHandler}
          placeholder="Enter your email" 
          autoComplete='off'/>
        </div>
        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input 
          type="text" 
          id="address" 
          name="address"
          onChange={inputHandler}
          placeholder="Enter your address" 
          autoComplete='off'/>
        </div>
        <div className="inputGroup">
        <button type="submit" class="btn btn-primary"> Submit </button>
        </div>
      </form>
    </div>
  );
};
export default AddUser;