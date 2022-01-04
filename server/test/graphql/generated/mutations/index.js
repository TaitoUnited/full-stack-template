
const fs = require('fs');
const path = require('path');

module.exports.createPost = fs.readFileSync(path.join(__dirname, 'createPost.gql'), 'utf8');
module.exports.createUser = fs.readFileSync(path.join(__dirname, 'createUser.gql'), 'utf8');
module.exports.deletePost = fs.readFileSync(path.join(__dirname, 'deletePost.gql'), 'utf8');
module.exports.deleteUser = fs.readFileSync(path.join(__dirname, 'deleteUser.gql'), 'utf8');
module.exports.updatePost = fs.readFileSync(path.join(__dirname, 'updatePost.gql'), 'utf8');
module.exports.updateUser = fs.readFileSync(path.join(__dirname, 'updateUser.gql'), 'utf8');
