const express=require('express');
const router=express.Router();
const storyController=require('../controllers/storyController');
const authMiddleware=require('../middleware/authMiddleware')
const chapterController=require('../controllers/chapterController')
router.post('/',authMiddleware,storyController.createStory)
router.get('/allstories',authMiddleware,storyController.allStories)
router.get('/yourstories',authMiddleware,storyController.userStories)
router.get('/story/:id',authMiddleware,storyController.getStory)
router.put('/update/:id',authMiddleware,storyController.updateStory)
router.delete('/deleteStory/:id',authMiddleware,storyController.deleteStory)

// CHAPTER ROUTES
router.post('/chapter',authMiddleware,chapterController.createChapter);
module.exports=router