import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {{
    
    res.status(200).json({
        message:"msst edkum chal hai bhai tu code kar aage ka"
    })
}});

export { registerUser };
