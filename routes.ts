import { Router, Request, Response } from "express";
import { Item } from "./item";


let itemArray:Item[] =[
    { id:1, quantity:20, price:10, product: "Eggs", isActive:true},
    { id:2, quantity:5, price:15, product: "Quinoa", isActive:true},
    { id:3, quantity:2, price:20.75, product: "Steak", isActive:true},
    { id:4, quantity:2000, price:1.2, product: "Gum", isActive:true}
];

export const itemRouter = Router();

itemRouter.get("/", async (req:Request, res:Response) : Promise<Response> => {
    if(req.query.maxPrice !== undefined){
        let underArray = itemArray.filter((x) => x.price <= Number(req.query.maxPrice) && x.isActive);
        return res.status(200).json(underArray);
    }
    //prefix is a parameter
    else if(req.query.prefix !== undefined){
        let startsWithArray = itemArray.filter((x) => x.product.startsWith(String(req.query.prefix)) && x.isActive);
        return res.status(200).json(startsWithArray);
    }

    else if(req.query.pageSize !== undefined){
        let sizeArray = itemArray.filter((x) => x.isActive).slice(0, Number(req.query.pageSize));
        return res.status(200).json(sizeArray);
    }

    else{
        return res.status(200).json(itemArray.filter((x) => x.isActive));
    }
});

itemRouter.get("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));

    if(itemIWantToFind === undefined){
        return res.status(404).send("ID not found");
    }
    else{
        return res.status(200).json(itemIWantToFind);
    }
});

itemRouter.post("/", async (req:Request, res:Response) : Promise<Response> => {
    let newItem:Item = {
        id: GetNextId(),
        product: String(req.body.product),
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        isActive:true
    };

    itemArray.push(newItem);

    return res.status(201).json(newItem);

    function GetNextId(){
        return Math.max(...itemArray.map((x) => x.id)) + 1;
    }

});

itemRouter.put("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let itemFound = itemArray.find((x) => x.id === Number(req.params.id));
    
    if(itemFound !== undefined){
        itemFound.price = Number(req.body.price);
        itemFound.product = String(req.body.product);
        itemFound.quantity = Number(req.body.quantity)

        return res.status(200).json(itemFound)
    }
    else{
        return res.status(400).send("Item not found");
    }
});

itemRouter.delete("/:id", async (req:Request,res:Response) : Promise<Response> => {
    let itemFound = itemArray.find((x) => x.id === Number(req.params.id));
        
    if(itemFound === undefined){
        return res.status(404).send("Who is it?");
    }
    else {
        itemArray = itemArray.filter((x) => x.id !== Number(req.params.id));
        
        itemFound.isActive = false;
        return res.status(204).send("Deleted");
}
});