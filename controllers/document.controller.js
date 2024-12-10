import  {Document} from "../model/documet.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {v4 as uuidv4} from "uuid"

const createDocument =  asyncHandler(async (req, res) => {
    const {
        doc_name,
        access_code,
        createdBy
    } = req.body;
    
    if(!doc_name.trim() || !access_code.trim() || !createdBy.trim()) {
        return res.status(400).json(new ApiResponse(400, false, "All fields are required"))
    }
    if(access_code.length < 8) {
        return res.status(400).json(new ApiResponse(400, false, "Access code must be at least 8 characters"))
    }
    const doc_id = uuidv4();
    const doc = await Document.create({
        doc_name:doc_name.trim(),
        doc_id:doc_id,
        access_code:access_code,
        data: {},
        total_users: 0,
        createdBy:createdBy.trim()
    })
    return res.status(200).json(new ApiResponse(200, true, "Document created successfully", {
        doc_id: doc_id,
        message: ["Press join room button to join the room"]
    }))

});

const fetchAllDouments = asyncHandler(async (req, res) => {
    const {doc_name, doc_id, createdBy, startDate, endDate} = req.query
    const queryObj = {}
    if(doc_name) queryObj.doc_name = { $regex: doc_name, $options: 'i' }
    if(doc_id) queryObj.doc_id = { $regex: doc_id, $options: 'i' }
    if(createdBy) queryObj.createdBy = { $regex: createdBy, $options: 'i' }
    if(startDate && endDate) {
        queryObj.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
    }

    const documents = await Document.find(queryObj).select('-access_code -data');;
    return res.status(200).json(new ApiResponse(200, true, "Documents fetched successfully", documents))
})
const accessingDocument = asyncHandler(async (req, res) => {
    const { doc_id, access_code } = req.body;

    if(!doc_id.trim()  || !access_code.trim()) {
        return res.status(400).json(new ApiResponse(400, false, "All fields are required"))
    }

    const doc = await Document.findOne({doc_id : doc_id.trim()}).select('-data');
    if(!doc) {
        return res.status(400).json(new ApiResponse(400, false, "Document not found"))
    }
    if(!(await doc.compareAccessCode(access_code))) {
        return res.status(400).json(new ApiResponse(400, false, "Invalid access code"))
    }
    return res.status(200).json(new ApiResponse(200, true, "Document accessed successfully", doc))
})
export {
    createDocument,
    fetchAllDouments,
    accessingDocument,
}