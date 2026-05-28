const pool=require('../db')

const createChapter=async (req,res)=>{
    const {title,content,chapter_number,story_id}=req.body

    try {
        const result=await pool.query(`
            INSERT INTO  chapters (title,content,chapter_number,
            story_id) VALUES($1,$2,$3,$4)
            `,
        [title,content,chapter_number,story_id]);

        res.status(201).json({
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
module.exports={
    createChapter
}