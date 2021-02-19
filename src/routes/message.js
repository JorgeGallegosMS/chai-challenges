const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', async (req, res) => {
    // TODO: Get all Message objects using `.find()`
    const messages = await Message.find({}).exec()
    // TODO: Return the Message objects as a JSON list
    return res.json({messages})

})

/** Route to get one message by id. */
router.get('/:messageId', async (req, res) => {
    // TODO: Get the Message object with id matching `req.params.id`
    // using `findOne`
    const message = await Message.findOne({_id: req.params.messageId})
    // TODO: Return the matching Message object as JSON
    return res.json({message})
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        const user = User.findOne({_id: req.body['author']})
        .then(res => res)
        .catch(err => console.error(err))
        return user
    })
    .then(user => {
        user.messages.unshift(message)
        return user.save()
    }).catch(err => console.error(err))
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', async (req, res) => {
    // TODO: Update the matching message using `findByIdAndUpdate`
    const updatedMessage = await Message.findByIdAndUpdate(req.params.messageId, req.body, {
        new: true
    }).exec()

    // TODO: Return the updated Message object as JSON
    return res.json({success: true, message: updatedMessage})
})

/** Route to delete a message. */
router.delete('/:messageId', async (req, res) => {
    // TODO: Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    const message = await Message.findByIdAndDelete(req.params.messageId).exec()
    // TODO: Return a JSON object indicating that the Message has been deleted
    return res.json({
        success: true, 
        message: `Message ${message._id} has been deleted`, 
        deleted: message
    })

})

module.exports = router