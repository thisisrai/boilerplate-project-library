/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Title'
          })
          .end(function(err, res){
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an array');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''
          })
          .end(function(err, res){
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing title');
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          done();
        });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5f2a90f5773db3006cf8e93b')
        .end(function(err, res){
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Title 2'
          })
          .end(function(err, res){
            if (err) done(err);
            let id = res.body._id

            chai.request(server)
            .get(`/api/books/${id}`)
            .end(function(err, res){
              if (err) done(err);
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an array');
              assert.property(res.body, 'comments', 'Books in array should contain comments');
              assert.property(res.body, 'title', 'Books in array should contain title');
              assert.property(res.body, '_id', 'Books in array should contain _id');
              done();
            });
        });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Title 3'
          })
          .end(function(err, res){
            if (err) done(err);
            let id = res.body._id

            chai.request(server)
            .post(`/api/books/${id}`)
            .end(function(err, res){
              if (err) done(err);
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an array');
              assert.property(res.body, 'comments', 'Books in array should contain comments');
              assert.property(res.body, 'title', 'Books in array should contain title');
              assert.property(res.body, '_id', 'Books in array should contain _id');
              done();
            });
        });
      });

    });

  });

});
