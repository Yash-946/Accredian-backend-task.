import express, { Request, Response, json } from 'express';
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
import { sendEmail } from './email/sentEmail';

const prisma = new PrismaClient()
const app = express();
const port = 3000;

app.use(cors());
app.use(json());

const referralSchema = z.object({
  name: z.string().min(1, "Name is required"),
  referredTo: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  courses: z.array(z.string()).min(1, "At least one course must be selected")
});

app.get('/', (req, res) => {
  res.send('Hello express!');
});

app.post("/referdata", async (req: Request, res: Response) => {
  try {

    const body = req.body
    const checkValidation = referralSchema.safeParse(body);
    // console.log(checkValidation);
    if(!checkValidation.success){
       return res.status(406).json({
        status: false,
        message: "Input fields are not correct"
       });
      }

    const data = await prisma.user.create({
      data: {
        ReferBy: body.name,
        ReferTo: body.referredTo,
        ReferEmail: body.email,
        Courses: { courses: body.courses }
      }
    })
    // console.log(data);

    const status = await sendEmail(body.name, body.referredTo, body.email, body.courses);
    console.log(status);
    if(!status!.id){
      return res.status(502).json({
        status: false,
        message: "Error in sending email"
      });
    }
    
    return res.status(200).json({
      status: true,
      message: "All good"
    });

  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error"
    });
  }

})

app.listen(port, () => {
  return console.log(`Express server is listening at http://localhost:${port} 🚀`);
});