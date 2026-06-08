import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../services/supabase'

import KPICard
from '../components/KPICard'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
}
from 'recharts'

export default function Dashboard() {

  const [dados,
    setDados] =
    useState([])

  const [total,
    setTotal] =
    useState(0)

  const [media,
    setMedia] =
    useState(0)

  const [baixo,
    setBaixo] =
    useState(0)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {

    const {
      data: alunos
    } = await supabase
      .from('alunos')
      .select('*')

    const {
      data: presencas
    } = await supabase
      .from('presencas')
      .select('*')

    const resultado =
      alunos.map(aluno => {

        const registros =
          presencas.filter(
            p =>
              p.aluno_id ===
              aluno.id
          )

        const presentes =
          registros.filter(
            r => r.presente
          ).length

        const percentual =
          registros.length
            ? (
              presentes /
              registros.length
            ) * 100
            : 0

        return {
          nome: aluno.nome,
          percentual
        }
      })

    setDados(resultado)

    setTotal(alunos.length)

    const mediaGeral =
      resultado.reduce(
        (acc, item) =>
          acc +
          item.percentual,
        0
      ) /
      (
        resultado.length || 1
      )

    setMedia(
      mediaGeral.toFixed(1)
    )

    setBaixo(
      resultado.filter(
        a =>
          a.percentual < 75
      ).length
    )
  }

  return (
    <div className="container">

      <h1>
        Dashboard
      </h1>

      <div className="kpis">

        <KPICard
          titulo="Alunos"
          valor={total}
        />

        <KPICard
          titulo="Frequência Média"
          valor={`${media}%`}
        />

        <KPICard
          titulo="Abaixo de 75%"
          valor={baixo}
        />

      </div>

      <BarChart
        width={800}
        height={400}
        data={dados}
      >
        <CartesianGrid />

        <XAxis
          dataKey="nome"
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="percentual"
        />
      </BarChart>

    </div>
  )
}