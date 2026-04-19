from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Optional

app = FastAPI(
    title="API da Biblioteca (Web Service)",
    version="1.0.0",
    description="API Multicamadas para gestão de livros desenvolvida com FastAPI"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir conexões de qualquer frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# CONFIGURAÇÃO DO BANCO DE DADOS (PostgreSQL)
# ==========================================
# IMPORTANTE: Altere o 'host' abaixo para o IP da sua VM 1
DB_CONFIG = {
    "user": "admin_biblio",
    "host": "IP_DA_VM1_AQUI",
    "password": "senha123",
    "database": "biblioteca",
    "port": 5432
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Erro ao conectar no banco de dados: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# ==========================================
# SCHEMAS (Modelos de Dados)
# ==========================================
class LivroCreate(BaseModel):
    titulo: str
    autor: str
    ano: Optional[int] = None
    editora: Optional[str] = None
    localizacao: Optional[str] = None
    edicao: Optional[str] = None

class Livro(LivroCreate):
    id: int

# ==========================================
# ROTAS DA API (CRUD de Livros)
# ==========================================

@app.on_event("startup")
def startup_event():
    print("🚀 Servidor backend FastAPI rodando na porta 3000")
    print("📄 Documentação da API (Swagger) disponível em: http://localhost:3000/docs")

@app.get("/livros", response_model=List[Livro], summary="Retorna a lista de todos os livros")
def get_livros():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT * FROM livros ORDER BY id ASC")
        livros = cursor.fetchall()
        return livros
    finally:
        cursor.close()
        conn.close()

@app.post("/livros", response_model=Livro, status_code=201, summary="Adiciona um novo livro")
def create_livro(livro: LivroCreate):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            INSERT INTO livros (titulo, autor, ano, editora, localizacao, edicao) 
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
            """,
            (livro.titulo, livro.autor, livro.ano, livro.editora, livro.localizacao, livro.edicao)
        )
        new_livro = cursor.fetchone()
        conn.commit()
        return new_livro
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.put("/livros/{livro_id}", response_model=Livro, summary="Atualiza os dados de um livro existente")
def update_livro(livro_id: int, livro: LivroCreate):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            UPDATE livros 
            SET titulo=%s, autor=%s, ano=%s, editora=%s, localizacao=%s, edicao=%s 
            WHERE id=%s RETURNING *
            """,
            (livro.titulo, livro.autor, livro.ano, livro.editora, livro.localizacao, livro.edicao, livro_id)
        )
        updated_livro = cursor.fetchone()
        conn.commit()
        if not updated_livro:
            raise HTTPException(status_code=404, detail="Livro não encontrado")
        return updated_livro
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.delete("/livros/{livro_id}", summary="Remove um livro do banco de dados")
def delete_livro(livro_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("DELETE FROM livros WHERE id = %s RETURNING *", (livro_id,))
        deleted_livro = cursor.fetchone()
        conn.commit()
        if not deleted_livro:
            raise HTTPException(status_code=404, detail="Livro não encontrado")
        return {"message": "Livro deletado com sucesso!"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Para rodar pelo VSCode ou diretamente pelo Python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
