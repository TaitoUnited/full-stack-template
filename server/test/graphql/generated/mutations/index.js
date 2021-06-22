
const fs = require('fs');
const path = require('path');

module.exports.createPost = fs.readFileSync(path.join(__dirname, 'createPost.gql'), 'utf8');
module.exports.deletePost = fs.readFileSync(path.join(__dirname, 'deletePost.gql'), 'utf8');
module.exports.updatePost = fs.readFileSync(path.join(__dirname, 'updatePost.gql'), 'utf8');
