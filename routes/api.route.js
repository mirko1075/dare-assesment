const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const axios = require("axios")
require("dotenv").config();


const ENDPOINT=process.env.ENDPOINT;
/* HELPER FUNCTIONS */
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLogin,
  }  = require("../middleware/middleware");

  /// Policy class
  class GetData {
    
    //Get clients
    static getAllClients (req, res) {
        let token=""
        if(req.session.user){
            token=req.session.user.token;
        }
        else{
           token = req.headers.authorization &&  req.headers.authorization.slice(7,req.headers.authorization.length)
        }
        if (!token){
            res.json
        }
        axios.get(`${ENDPOINT}/clients`,  {headers: {
            'Authorization': `Bearer ${token}`
          }})
        .then((response)=>{
            return res.status(200).json(response.data)
        })
        .catch((err)=>{
            if (err.response.data.message.includes("Authorization token expired")){
                if(req.session.user){
                    //retrive new token
                    const { client_id, client_secret } = req.session.user;
                    axios.post(`${ENDPOINT}/login`,{client_id, client_secret})
                    .then((response)=>{
                        const user={client_id, client_secret, token:response.data.token}
                        req.session.user=user;
                        axios.get(`${ENDPOINT}/clients`,  {headers: {
                            'Authorization': `Bearer ${response.data.token}`
                            }})
                        .then((response)=>{
                            return res.status(200).json(response.data)
                        })
                        .catch((err)=>{
                            return res.status(400).json(err)
                            })  
                    })
                    .catch((err)=>{
                        return res.status(400).json(err)
                    })      
                }else{
                    const err=createError(400); // Bad Request
                    return res.status(400).json(err)
                }
            }
            else{
                return res.status(400).json(err.response.data)            
            }
        })
    }

// Get policies
  static getAllPolicies(req, res)  {
    let token=""
    if(req.session.user){
        token=req.session.user.token;
    }
    else{
        token = req.headers.authorization &&  req.headers.authorization.slice(7,req.headers.authorization.length)
    }
    axios.get(`${ENDPOINT}/policies`,  {headers: {
        'Authorization': `Bearer ${token}`
      }})
    .then((response)=>{
        return res.status(200).json(response.data)
    })
    .catch((err)=>{
        if (err.response.data.message.includes("Authorization token expired")){
            if(req.session.user){
                //retrive new token
                const { client_id, client_secret } = req.session.user;
                axios.post(`${ENDPOINT}/login`,{client_id, client_secret})
                .then((response)=>{
                    const user={client_id, client_secret, token:response.data.token}
                    req.session.user=user;
                    axios.get(`${ENDPOINT}/clients`,  {headers: {
                        'Authorization': `Bearer ${response.data.token}`
                        }})
                    .then((response)=>{
                        return res.status(200).json(response.data)
                    })
                    .catch((err)=>{
                        return res.status(400).json(err)
                        })  
                })
                .catch((err)=>{
                    return res.status(400).json(err)
                })      
                const err=createError(400); // Bad Request
                return res.status(400).json(err)
            }
        }
        else{
            return res.status(400).json(err.response.data)            
        }
    })
  }
}
/* ROUTES  */

  router.get("/clients", isLoggedIn, GetData.getAllClients);
  router.get("/policies", isLoggedIn, GetData.getAllPolicies);


module.exports = router;
