import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function Alunos() {

  const [alunos, setAlunos] = useState([])

  const [nome, setNome] = useState('')
  const [matricula, setMatricula] = useState('')

  const [editando, setEditando] =
    useState(null)

  async function carregarAlunos() {

    const { data } = await supabase
      .from('alunos')
      .select('*')
      .order('nome')

    setAlunos(data || [])
  }

  useEffect(() => {
    carregarAlunos()
  }, [])

  async function salvarAluno() {

    if (!nome.trim()) {
      alert('Nome obrigatório')
      return
    }

    if (!matricula.trim()) {
      alert('Matrícula obrigatória')
      return
    }

    if (editando) {

      await supabase
        .from('alunos')
        .update({
          nome,
          matricula
        })
        .eq('id', editando)

    } else {

      await supabase
        .from('alunos')
        .insert({
          nome,
          matricula
        })
    }

    setNome('')
    setMatricula('')
    setEditando(null)

    carregarAlunos()
  }

  async function excluirAluno(id) {

    const confirmar =
      confirm('Excluir aluno?')

    if (!confirmar) return

    await supabase
      .from('alunos')
      .delete()
      .eq('id', id)

    carregarAlunos()
  }

  return (
    <div className="container">

      <h1>Cadastro de Alunos</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) =>
          setNome(e.target.value)
        }
      />

      <input
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) =>
          setMatricula(e.target.value)
        }
      />

      <button onClick={salvarAluno}>
        {editando
          ? 'Atualizar'
          : 'Cadastrar'}
      </button>

      <table>

        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {alunos.map(aluno => (

            <tr key={aluno.id}>

              <td>{aluno.nome}</td>

              <td>
                {aluno.matricula}
              </td>

              <td>

                <button
                  onClick={() => {
                    setEditando(aluno.id)
                    setNome(aluno.nome)
                    setMatricula(
                      aluno.matricula
                    )
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    excluirAluno(aluno.id)
                  }
                >
                  Excluir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}