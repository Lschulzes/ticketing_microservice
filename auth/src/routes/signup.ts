import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

const router = Router();

router.post(
  `/`,
  [
    body("email").isEmail().withMessage("Must be an valid email."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    const { email, password } = req.body;

    res.send({});
  }
);

export { router as signupRouter };
