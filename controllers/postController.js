const connection = require('../data/db');




//index
function index(req, res) {
    const sql = 'SELECT * FROM posts';
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}

//show
function show(req, res) {
    const id = parseInt(req.params.id);

    // Query per ottenere il post specifico
    const sql = 'SELECT * FROM posts WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) return res.status(404).json({ error: 'Post not found' });

        res.json(results[0]); // Restituiamo solo il post specifico
    });
}




// store
function store(req, res) {
    //console.log(req.body);
    // res.send('Creazione nuovo post');

    // creo nuovo id incrementando dall ultimo id presente
    const newId = posts[posts.length - 1].id + 1;

    // creo nuovo blog
    const nuovoPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    // add nuovo post
    posts.push(nuovoPost);


    // risposta corretta del nuovo post 
    res.status(201);
    res.json(nuovoPost);
}

// update
function update(req, res) {
    // trasformo l id in numero
    const id = parseInt(req.params.id);

    // cerco il post tramite l id
    const post = posts.find(post => post.id === id);

    // controllo se il post esiste
    if (!post) {
        // se il post non esiste ritorno questo stato
        res.status(404);

        return res.json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        });
    }

    // oggetto modificato
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;


    // restituiamo l'oggetto modificato
    res.json(post);

}

// delete
function destroy(req, res) {
    // trasformo l id in numero
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ?'
    //Eliminiamo la pizza dal menu
    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete posts' });
        res.sendStatus(204)
    });
}
// esportiamo tutto
module.exports = { index, show, store, update, destroy }