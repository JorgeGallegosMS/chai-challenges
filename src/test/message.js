require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const userId = 'zzzzzzzzzzzz'
const messageId = 'xxxxxxxxxxxx'
const newMessageId = 'vvvvvvvvvvvv'
let user
let message
let messages = []

describe('Message API endpoints', () => {
    before(async () => {
        try {
            // TODO: add any beforeEach code here
            const newUser = await User.create({
                username: 'jorge',
                password: 'jorge',
                _id: userId
            })
            user = newUser
    
            const newMessage = await Message.create({
                title: 'Turtles',
                body: 'I like turtles',
                author: userId,
                _id: messageId
            })
    
            message = newMessage
            messages.push(message)
            
            return {newUser, message} 
        } catch (err) {
            console.error(err)
        }
    })

    after(async () => {
        try {
            // TODO: add any afterEach code here
            const deletedUser = await User.findOneAndDelete({_id: userId})
            const deletedMessages = await Message.deleteMany({_id: [messageId, newMessageId]})
            messages = []
            return {deletedUser, deletedMessages}
        } catch (err) {
            console.error(err)
        }
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            expect(res.body.messages).to.be.an('array')
            // expect(res.body.messages).to.be.gte(0)
        })
        done()
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get(`/messages/${messageId}`)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            expect(res.body.message).to.be.an('object')
            expect(res.body.message['title']).to.equal('Turtles')
        })
        done()
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({
            title: 'Pizza',
            body: 'I like pizza',
            author: userId,
            _id: newMessageId
        })
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.be.a('string')
            expect(res.body.title).to.equal('Pizza')
            messages.push(res.body)
        })
        done()
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .put(`/messages/${newMessageId}`)
        .send({
            title: 'Pizzzzzzza'
        })
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            expect(res.body.message.title).to.be.a('string')
            expect(res.body.message.title).to.equal('Pizzzzzzza')
        })
        done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .delete(`/messages/${newMessageId}`)
        .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res.body.success).to.equal(true)
            expect(res.body.message).to.equal('Message 767676767676767676767676 has been deleted')
        })
        done()
    })
})
