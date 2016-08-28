var express = require('express');

export let app = express();

const Mongorito = require('mongorito');
const Model = Mongorito.Model;
const co = require('co')

// define model
class Post extends Model {

}

console.log(`entered`);
co(function* () {

    // connect to localhost/blog
    console.log(`connecting`);
    yield Mongorito.connect('localhost/blog');
    console.log(`connected`);


    // create and save new Post document
    let post = new Post({
        title: 'Node.js with --harmony rocks!',
        body: 'Long post body',
        author: {
            name: 'John Doe'
        }
    });
    //
    console.log(`saving`);
    yield post.save();
    console.log(`saved`);

    console.log(`saved post ${ JSON.stringify(post) }`);
    // update document
    post.set('title', 'Post got a new title!');


    post.set('author.name', 'Doe John');
    yield post.save();

    return 'returned';

}).then(function (value) {
    console.log(value);
    Mongorito.close(); //close here too
    console.log(`disconnected`);
}, function (err) {
    Mongorito.close(); //close here too
    console.error(err.stack);
    console.log(`disconnected with error`);
});

//.catch(function(err){
//  Mongorito.close(); //close here too
//  throw err; //rethrow error
//});


app.get('/', function (req, res) {
    res.send('Hello World!');
    console.log('hello world requested');
});


