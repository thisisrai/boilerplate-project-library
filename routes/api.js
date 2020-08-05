/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DATABASE;
var mongoose = require('mongoose');
const { response } = require('express');
var Schema = mongoose.Schema;

mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => console.log('connected to mongodb!'))
  .catch(error => console.log('there was an error!', error));

let bookSchema = new Schema({
  title: {
    type: String,
  },
  comments: [{
    type: String
  }]
})

let Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).lean().exec((err, books) => {
        books.forEach((book) => {
          book['commentcount'] = book.comments.length
          delete book.comments
        })
        res.send(books)
      })
    })

    .post(function (req, res){
      var title = req.body.title;
      let newBook = new Book({
        title
      })

      newBook.save((err, result) => {
        if (err) res.send({"Error": err})
        res.send(result)
      })
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, result) => {
        res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.find({_id: bookid}, (err, book) => {
        if (err) res.send("no book exists")
        res.send(book[0])
      })
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;

      Book.findById(bookid, (err, book) => {
        book.comments.push(comment)
        book.save((err, result) => {
          if (err) res.send({"Error": err})
          res.send(result)
        })
      })
    })

    .delete(function(req, res){
      var bookid = req.params.id;

      Book.findByIdAndRemove(bookid, function (err, issue) {
        res.send('delete successful')
      });
      //if successful response will be 'delete successful'
    });

};
