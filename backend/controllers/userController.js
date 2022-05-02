import User from "../models/User.js";
import { generateID } from "../helpers/generateID.js";
import { createJWT } from "../helpers/createJWT.js";

//comunicate routing w/ models.
const registry = async (req,res) => {
    //evoit duplicated
    const { email } = req.body;
    const userExists = await User.findOne({ email }); //email:email
    
    if (userExists) {
        const error = new Error(`User ${email} already exists`);
        return res.status(400).send({ message:error.message});
    }
    try {
        //create new user and give it an ID
        const user = new User(req.body);
        user.token = generateID();
        const storedUser = await user.save();
        res.status(200).json(storedUser);
    } catch (err) {
        console.log(err);
    }
}

const auth = async (req,res) => {
    const { email, password } = req.body;
    //verifying if user is already logged in 
    const user = await User.findOne({ email });
        if (!user) {
        const error = new Error(`User ${email} doesn't exist`);
        return res.status(404).send({ message:error.message});
    }
    //verifying if user is confirmed
        if(!user.confirmed){
            const error = new Error(`Your account is not confirmed`);
            return res.status(403).send({ message:error.message});
        }    
    // verifying password
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            const error = new Error(`Incorrect password`);
            return res.status(403).send({ message:error.message});
        }else{
            //construyo un objeto para no enviar el password,
            //o información sensible, JWT
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token: createJWT(user._id)
            });
        }
    }

const confirm = async (req,res)=>{
    const { tokenURL } = req.params;
    const userConfirm = await User.findOne({ token:tokenURL });
    if(!userConfirm){
        const error = new Error(`User not found d^_^b`);
        return res.status(404).send({ message:error.message});
    }
        userConfirm.confirmed = true;
        userConfirm.token = "";
        const updatedUser = await userConfirm.save();
        res.json(updatedUser);
}

const forgotPassword = async (req,res) => {
    //send email with token
    const { email }= req.body
    const user = await User.findOne({ email });
    if(!user){
        const error = new Error(`User ${email} doesn't exist`);
        return res.status(404).send({ message:error.message});
    }
    //generate token
    try{
        user.token = generateID()   
        const updatedUser = await user.save();
        res.json({msg:`We have sent an email with the instructions to ${updatedUser.name}`})
    } catch(err){
        console.log(err);
      }
}

const matchToken = async (req,res) => {
    const { token } = req.params;
    const validToken = await User.findOne({ token } )
    if(validToken){ 
        res.json({msg:`Token valid`})

    }else{
        const error = new Error(`Token not valid`);
        res.status(403).json({msg:error.message});
    }
}

const newPassword = async (req,res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ token });
    if(user){
       user.password = password;
       user.token = "";
        try {
           await user.save();
           res.json({msg:`Password update success`})
           
        } catch (error) {
           console.log(error);
        }
    }
}

const profile = async (req,res) => {
    const { user } = req ;
    res.json( user );
}
export{
    registry,
    auth,
    confirm,
    forgotPassword,
    matchToken,
    newPassword,
    profile
}