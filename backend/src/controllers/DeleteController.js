const Post = require('../models/Post');
//FUNÇÃO PARA APAGAR A PUBLICAÇÃO
module.exports = {    
    async delete(req, res){
        const post = await Post.findByIdAndDelete(req.params.id);

        req.io.emit('delete', post);

        return res.json(post);
    }
};