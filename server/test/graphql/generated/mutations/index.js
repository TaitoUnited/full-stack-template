
const fs = require('fs');
const path = require('path');

module.exports.createPost = fs.readFileSync(path.join(__dirname, 'createPost.gql'), 'utf8');
module.exports.createPostAttachment = fs.readFileSync(path.join(__dirname, 'createPostAttachment.gql'), 'utf8');
module.exports.deletePost = fs.readFileSync(path.join(__dirname, 'deletePost.gql'), 'utf8');
module.exports.deletePostAttachment = fs.readFileSync(path.join(__dirname, 'deletePostAttachment.gql'), 'utf8');
module.exports.finalizePostAttachment = fs.readFileSync(path.join(__dirname, 'finalizePostAttachment.gql'), 'utf8');
module.exports.updatePost = fs.readFileSync(path.join(__dirname, 'updatePost.gql'), 'utf8');
module.exports.updatePostAttachment = fs.readFileSync(path.join(__dirname, 'updatePostAttachment.gql'), 'utf8');
