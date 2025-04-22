
// const express = require('express');
// const Request = require('../models/Request');
// const BookIssue = require('../models/BookIssue');

// const router = express.Router();

// router.get('/adminlogin', async (req, res) => {
//     try {
//         const requests = await Request.find(); // All pending requests
//         const records = await BookIssue.find(); // All issued books
//         res.render('adminlogin', { requests, records });
//     } catch (err) {
//         console.error("Error fetching admin data:", err);
//         res.status(500).send("Server Error");
//     }
// });

// module.exports = router;

const express = require('express');
const Request = require('../models/Request');
const BookIssue = require('../models/BookIssue');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Path to the JSON file
const jsonFilePath = path.join(__dirname, '..', 'public', 'books', 'dept_lib_new.json');

router.get('/adminlogin', async (req, res) => {
    try {
        const requests = await Request.find(); // All pending requests
        const records = await BookIssue.find(); // All issued books

        // Read book availability from JSON
        const booksData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Update requests with availability info
        const updatedRequests = requests.map(request => {
            const matchedBook = booksData.find(book =>
                book.Name.trim().toLowerCase() === request.Book_name.trim().toLowerCase()
            );
            return {
                ...request._doc,
                Available: matchedBook ? matchedBook.Available : "unknown"
            };
        });

        res.render('adminlogin', { requests: updatedRequests, records });
    } catch (err) {
        console.error("Error fetching admin data:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
