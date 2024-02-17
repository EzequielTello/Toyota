import { Router } from "express";

const homeHandlebarsRouter = Router();

homeHandlebarsRouter.get("/", (req, res) => {
  res.render("homeHandlebars");
});

export { homeHandlebarsRouter };
