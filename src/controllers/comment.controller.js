import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {

    // TODO: To get all comments for a video with pagination
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const lim = Math.max(1, parseInt(limit, 10) || 10)
    const skip = (pageNum - 1) * lim

    const [comments, total] = await Promise.all([
        Comment.find({ video: videoId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(lim)
            .populate('owner', 'username avatar'),
        Comment.countDocuments({ video: videoId })
    ])

    const pagination = {
        page: pageNum,
        limit: lim,
        total,
        totalPages: Math.ceil(total / lim) || 1
    }

    return res.status(200).json(new ApiResponse(200, { comments, pagination }, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    //TODO: To add a comment

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    const populated = await comment.populate('owner', 'username avatar')

    return res.status(201).json(new ApiResponse(201, populated, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    //TODO: To update a comment

    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found")

    if (comment.owner?.toString() !== req.user._id?.toString()) {
        throw new ApiError(403, "Not authorized to update this comment")
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new ApiError(400, "Comment content is required")
    }

    comment.content = content.trim()
    await comment.save()

    const populated = await Comment.findById(comment._id).populate('owner', 'username avatar')

    return res.status(200).json(new ApiResponse(200, populated, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    //TODO: To delete a comment
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found")

    if (comment.owner?.toString() !== req.user._id?.toString()) {
        throw new ApiError(403, "Not authorized to delete this comment")
    }

    await comment.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }