const pool=require('../db');
const { userStories } = require('./storyController');

const createChapter=async (req,res)=>{
    const {title,content,chapter_number,story_id}=req.body

    try {
        const result=await pool.query(`
            INSERT INTO  chapters (title,content,chapter_number,
            story_id) VALUES($1,$2,$3,$4)
            RETURNING *
            `,
        [title,content,chapter_number,story_id]);

        res.status(201).json({
            success:true,
            data:result.rows[0]
        })
    } catch (error) {
  res.status(500).json({
            success: false,
            error: error.message
        });
    }    
}

const updateChapter = async (req,res)=>{
    const{title,content,chapter_number} = req.body
    const{id}=req.params

    try {
        const result=await pool.query( `
            UPDATE chapters SET title=$1 ,content=$2,chapter_number=$3 WHERE id=$4
            `,[title,content,chapter_number,id])

            res.status(200).json({
                success:true,
                data:result.rows
            })
    } catch (error) {
 res.status(500).json({
            success: false,
            error: error.message
                });
    }
}
const deleteChapter= async (req,res)=>{
    const{id}=req.params

    try {
    const result=await pool.query(`
        DELETE FROM chapters WHERE id=$1`,[id]   )

        res.status(200).json({
            success:true
        })
    } catch (error) {
           res.status(500).json({
            success: false,
            error: error.message
        });
    }
    }

    const getChaptterForStories=async(req,res)=>{
        const {id}=req.params
        try {
            const result=await pool.query(`
                SELECT id, title, content,chapter_number, created_at FROM   chapters WHERE story_id=$1 
                  ORDER BY chapter_number ASC
                `,[id])

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
const comments =async(req,res)=>{
    const{note,story_id,user_id}
try {
    const result=await pool.query(
        `INSERT INTO chapters  (note,story_id,user_id) VALUES($1,$2,$3) RETURNING *`,[note,story_id,user_id]
    )
      res.status(201).json({
            success: true,
            story: result.rows[0]
        });
} catch (error) {
    res.status(500).json({
            success: false,
            error: error.message
        });
}
}
module.exports={
    createChapter,updateChapter,deleteChapter,getChaptterForStories
}