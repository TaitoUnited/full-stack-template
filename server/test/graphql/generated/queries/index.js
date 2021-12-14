
const fs = require('fs');
const path = require('path');

module.exports.post = fs.readFileSync(path.join(__dirname, 'post.gql'), 'utf8');
module.exports.posts = fs.readFileSync(path.join(__dirname, 'posts.gql'), 'utf8');
module.exports.user = fs.readFileSync(path.join(__dirname, 'user.gql'), 'utf8');
module.exports.users = fs.readFileSync(path.join(__dirname, 'users.gql'), 'utf8');
