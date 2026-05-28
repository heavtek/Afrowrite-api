const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const register = async (req, res) => {

    const { name, email, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
    try {

        const result = await pool.query(
            `
            INSERT INTO users(name, email, password)
            VALUES($1, $2, $3)
            RETURNING *
            `,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};

const getUser =async (req,res)=>{
    const{id}=req.params;
    try {
        const result=await pool.query (
            `SELECT  id, name, email, created_at FROM users WHERE id=$1`,
            [id]
        );
        if(result.rows.length===0){
            return res.status(404).json(
                {
                    success:false,
                    error:"user not found"
                }
            )
         
        }
             res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
            console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
}
const updateuser=async(req,res)=>{
    const{email,name}=req.body;
    const{id}=req.params;

    try {
        const result=await pool.query(`UPDATE users
SET email=$1, name=$2
WHERE id=$3
RETURNING *`,
           [email, name, id]
        )
     
        res.json({
            sucess:true,
                })

    } catch (error) {
          console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
const login =async (req,res)=>{
    const{email,password}=req.body

try {
    const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: 'User not found'
            });

        }
          const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            success: true,
            token
        });

} catch (error) {
    
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

}
}
module.exports = {
     register,
    getUser,
    updateuser,
    login
};