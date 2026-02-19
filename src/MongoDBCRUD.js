const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect (
    "mongodb://admin:KYYtnp86997@node86170-fs-268-far.th.app.ruk-com.cloud:11848",

    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const Book = mongoose.model("Book", {
    id: {
        type: Number,
        unique: true,
        require: true,
    },

    title: String,
    author: String,
});

const app = express();
app.use(bodyParser.json());

app.post("/books",async (req, res) => {
    try {
        const lastBook = await Book.findOne().sort({id: -1});
        const nextID = lastBook ? lastBook.id + 1 : 1;

        const book = new Book({
            id: nextID,
            ...req.body,
        });

        await book.save();
        res.send(book);
    } catch(error) {
        res.status(500).send(error);
    }
});

app.get("/books", async (req, res) => {
    try {
        const book = await Book.findOne({id:req.params.id});
        res.send(book);
    } catch(error) {
        res.status(500).send(error);
    }
});

app.put("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({id:req.params.id}, req.body, {
            new: true,
        });

        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({id:req.params.id});
        res.send(book);
    } catch(error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server started at https://localhost:${PORT}`);
});