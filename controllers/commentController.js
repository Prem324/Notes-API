const commentService=require("../services/commentService");
const {sendSuccess}=require("../utils/apiResponse");

const createComment=async(req,res)=>{
    const comment=await commentService.createComment(
        req.body.text,
        req.params.noteId,
        req.user.id
    );

    return sendSuccess(
        res,201,"Comment created successfully",comment
    )
};

const getCommentsByNote=async(req,res)=>{
    const comments=await commentService.getCommentsByNote(req.params.noteId);

    return sendSuccess(
        res,200,"Comments fetched successfully",comments
    )
};

module.exports={createComment,getCommentsByNote};