import express, {Application, Request, Response} from 'express';
import { itemRouter } from './routes';

const app:Application = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/items", itemRouter);

app.listen(port, ():void => {
    console.log(`listening on port ${port}`);
});