import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../services/supabase'

export default function Presencas() {

  const [alunos, setAlunos] =
    useState([])

  const [presencas,
    setPresencas] =
    useState({})

  const [data,
    setData] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    )

  useEffect(() => {
    carregarAlunos()
  }, [])

  useEffect(() => {
    carregarChamada()
  }, [data])

  async function carregarAlunos() {

    const { data: alunos } =
      await supabase
        .from('alunos')
        .select('*')
        .order('nome')

    setAlunos(alunos || [])
  }

  async function carregarChamada() {

    const { data: registros } =
      await supabase
        .from('presencas')
        .select('*')
        .eq(
          'data_chamada',
          data
        )

    const obj = {}

    registros?.forEach(item => {
      obj[item.aluno_id] =
        item.presente
    })

    setPresencas(obj)
  }

  async function salvar() {

    const registros =
      alunos.map(aluno => ({
        aluno_id: aluno.id,
        data_chamada: data,
        presente:
          presencas[aluno.id] || false
      }))

    await supabase
      .from('presencas')
      .upsert(
        registros,
        {
          onConflict:
            'aluno_id,data_chamada'
        }
      )

    alert('Salvo!')
  }

  return (
    <div className="container">

      <h1>
        Registro de Presença
      </h1>

      <input
        type="date"
        value={data}
        onChange={(e) =>
          setData(e.target.value)
        }
      />

      {alunos.map(aluno => (

        <div
          key={aluno.id}
          className="linha"
        >

          <span>
            {aluno.nome}
          </span>

          <input
            type="checkbox"
            checked={
              presencas[
                aluno.id
              ] || false
            }
            onChange={(e) =>
              setPresencas({
                ...presencas,
                [aluno.id]:
                  e.target.checked
              })
            }
          />

        </div>

      ))}

      <button onClick={salvar}>
        Salvar Chamada
      </button>

    </div>
  )
}