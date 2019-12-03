const Post = require('../models/Post');

//FUNÇÃO PARA CURTIR UMA PUBLICAÇÃO
module.exports = {    
    async store(req, res){
        const post = await Post.findById(req.params.id);

        post.curtidas += 1;

        await post.save();

        req.io.emit('like', post);

        return res.json(post);
    }
};