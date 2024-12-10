import { Router } from "express";
import { accessingDocument, createDocument, fetchAllDouments } from "../controllers/document.controller.js";

const router = Router();

router.route("/create-doc")
        .post(createDocument)
router.route('/fetch-docs')
        .get(fetchAllDouments)
router.route('/access-doc')
        .post(accessingDocument)

export default router