const API_URL = 'http://192.168.1.15:3000/livros'; // <-- ALTERE O 'localhost' PELO IP DA VM 2

// Elementos do DOM
const form = document.getElementById('book-form');
const grid = document.getElementById('books-grid');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// Campos
const idInput = document.getElementById('book-id');
const tituloInput = document.getElementById('titulo');
const autorInput = document.getElementById('autor');
const anoInput = document.getElementById('ano');
const editoraInput = document.getElementById('editora');
const localizacaoInput = document.getElementById('localizacao');
const edicaoInput = document.getElementById('edicao');

let isEditing = false;

// Carregar Livros ao abrir a página
document.addEventListener('DOMContentLoaded', fetchBooks);

async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        grid.innerHTML = '<div style="color:red; padding: 20px;">Falha ao conectar no Servidor Backend. Verifique se o IP no app.js está correto e se o backend na VM 2 está rodando.</div>';
    }
}

function renderBooks(books) {
    grid.innerHTML = '';
    if (books.length === 0) {
        grid.innerHTML = '<div>Nenhum livro cadastrado.</div>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-title">${book.titulo}</div>
            <div class="book-author">${book.autor}</div>
            <div class="book-detail"><span>Ano:</span> <strong>${book.ano || '-'}</strong></div>
            <div class="book-detail"><span>Edição:</span> <strong>${book.edicao || '-'}</strong></div>
            <div class="book-detail"><span>Editora:</span> <strong>${book.editora || '-'}</strong></div>
            <div class="book-detail"><span>Localização:</span> <strong>${book.localizacao || '-'}</strong></div>
            <div class="card-actions">
                <button class="btn-sm btn-edit" onclick="editBook(${book.id}, '${book.titulo}', '${book.autor}', '${book.ano}', '${book.editora}', '${book.localizacao}', '${book.edicao}')">Editar</button>
                <button class="btn-sm btn-delete" onclick="deleteBook(${book.id})">Excluir</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Salvar ou Atualizar Livro
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookData = {
        titulo: tituloInput.value,
        autor: autorInput.value,
        ano: anoInput.value ? parseInt(anoInput.value) : null,
        editora: editoraInput.value,
        localizacao: localizacaoInput.value,
        edicao: edicaoInput.value
    };

    try {
        if (isEditing) {
            // Atualizar (PUT)
            await fetch(`${API_URL}/${idInput.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        } else {
            // Criar (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        }

        resetForm();
        fetchBooks();
    } catch (error) {
        alert('Erro ao salvar livro!');
        console.error(error);
    }
});

// Preparar formulário para edição
window.editBook = function (id, titulo, autor, ano, editora, localizacao, edicao) {
    isEditing = true;
    idInput.value = id;
    tituloInput.value = titulo;
    autorInput.value = autor;
    anoInput.value = ano !== 'null' ? ano : '';
    editoraInput.value = editora !== 'null' ? editora : '';
    localizacaoInput.value = localizacao !== 'null' ? localizacao : '';
    edicaoInput.value = edicao !== 'null' ? edicao : '';

    formTitle.innerText = "Editar Livro";
    btnSave.innerText = "Atualizar Livro";
    btnCancel.classList.remove('hidden');
}

// Deletar Livro
window.deleteBook = async function (id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchBooks();
        } catch (error) {
            alert('Erro ao deletar livro!');
        }
    }
}

// Cancelar edição
btnCancel.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    form.reset();
    idInput.value = '';
    formTitle.innerText = "Adicionar Novo Livro";
    btnSave.innerText = "Salvar Livro";
    btnCancel.classList.add('hidden');
}
