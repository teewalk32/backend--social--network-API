const router = require('express').Router();
const {
    getAll,
    getOne,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController');


router.route('/').get(getAll).post(createThought);


router.route('/:Id').get(getOne).put(updateThought).delete(deleteThought);


router.route('/:studentId/reactions').post(addReaction).delete(deleteReaction);



module.exports = router;
