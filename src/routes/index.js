const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('partials/index');
});
router.get('/about', (req, res) => {
    res.render('partials/about');
});

module.exports = router;

// router.post('/notes/new-note', isAuthenticated, async (req, res) => {
//     const { title, description } = req.body;
//     const errors = [];
//     if (!title) {
//         errors.push({ text: "Por favor, inserte un titulo" });
//     }
//     if (!description) {
//         errors.push({ text: "Por favor, inserte una descripcion" });
//     }
//     if (errors.length > 0) {
//         res.render('notes/new-note', {
//             errors,
//             title,
//             description
//         });
//     }
//     else {
//         const newNote = new Note({ title, description });
//         newNote.user = req.user.id;
//         await newNote.save();
//         req.flash('success_msg', 'Nota guardada satisfactoriamente');
//         res.redirect("/notes");
//     }
// });