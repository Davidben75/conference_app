import express from "express";
import {
    organizeConference,
    changeSeats,
    changeConferenceDates,
} from "../controllers/conference.controllers";
import { isAuthenticated } from "../middlewares/authentication.middleware";
import container from "../config/dependency-injection";

const router = express.Router();

router.use(isAuthenticated);
router.post("/conference", organizeConference(container));
router.patch("/conference/seats/:id", changeSeats(container));
router.patch("/conference/dates/:id", changeConferenceDates(container));

export default router;
