const pool=require('../db')

const createStory = async(req,res)=>{
    const{title,description,genre}=req.body
    const user_id = req.user.id;
    try {
          const result = await pool.query(`
            INSERT INTO stories (  title,
                description,
                genre,
                user_id)  VALUES($1, $2, $3, $4)
            RETURNING *`,  [title, description, genre, user_id])
                res.status(201).json({
            success: true,
            story: result.rows[0]
        });
    } catch (error) {
            console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
 
}
 const allStories =async (req,res)=>{
    try {
          const result=await pool.query(
        'SELECT  id, title, description,genre, created_at FROM stories'
    ) 
    res.status(200).json({
        success:true,
        story:result.rows
    })
    } catch (error) {
        res.status(404).json({
            success:false,
 error: error.message
        })
    }
 
 }

 const getStory= async (req,res)=>{
    const{id}=req.params

    try {
        const result=await pool.query(
             `SELECT id, title, description,genre, created_at  FROM stories WHERE id=$1`,[id]
        )

        res.status(200).json({
            success:true,
            story:result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
 }
 const updateStory =async(req,res)=>{
    const{title,description,genre}=req.body
    const{id}=req.params

  try {
            const story = await pool.query(
            `
            SELECT *
            FROM stories
            WHERE id = $1
            `,
            [id]
        );
 if (story.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: 'Story not found'
            });

        }

 const authUser =
            story.rows[0].user_id === req.user.id;
              if (!authUser) {

            return res.status(403).json({
                success: false,
                error: 'Unauthorized'
            });

        }
        const result=await pool.query(`
            UPDATE stories SET  title=$1,description=$2,genre=$3  WHERE id=$4 RETURNING *`,
           [title, description, genre, id])

            res.status(201).json({
                success:true,
                story:result.rows[0]
            })
    } catch (error) {
           res.status(500).json({
            success: false,
            error: error.message
        });
    }
    
  
 }
 const deleteStory=async(req,res)=>{
    const{id}=req.params

    try {
        const story=await pool.query(`
            SELECT * FROM stories WHERE id=$1`,[id]);

            if(story.rows.length===0){
                return res.status(400).json({
                    success:false,
                    error:"not Found"
                })
            }
           const authUser=story.rows[0].user_id===req.user.id
            if(!authUser){
                return res.status(403).json({
                    success:false,
                    message:"UnAuthorized"
                });
            }
        const result=await pool.query(
            `
            DELETE  FROM stories WHERE id=$1
            `,
            [id]
        )
        res.status(200).json({
            success:true,
            
        })
    } catch (error) {
          res.status(500).json({
            success: false,
            error: error.message
        });
    }
 }
 const userStories=async (req,res)=>{

    const logedinUser=req.user.id
    try {
       const result=await pool.query(`
        SELECT * FROM stories WHERE user_id=$1
        `,[logedinUser])  

        res.status(200).json({
            success:true,
            data:result.rows
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
   
 }
module.exports = {
    createStory,allStories,getStory,updateStory,deleteStory,userStories
};