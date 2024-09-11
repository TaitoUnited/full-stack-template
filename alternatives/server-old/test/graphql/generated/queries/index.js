
const fs = require('fs');
const path = require('path');

module.exports.allowedPostAttachmentMimeTypes = fs.readFileSync(path.join(__dirname, 'allowedPostAttachmentMimeTypes.gql'), 'utf8');
module.exports.post = fs.readFileSync(path.join(__dirname, 'post.gql'), 'utf8');
module.exports.postAttachment = fs.readFileSync(path.join(__dirname, 'postAttachment.gql'), 'utf8');
module.exports.posts = fs.readFileSync(path.join(__dirname, 'posts.gql'), 'utf8');
