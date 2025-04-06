import express from "express";
import { getAllMembers, getMemberById, createMember, updateMember, deleteMember } from "../controllers/teamController";
import { body } from "express-validator";

const router = express.Router();


router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("position").notEmpty().withMessage("Position is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  createMember
);


router.put("/:id", updateMember);

router.delete("/:id", deleteMember);

export default router;
