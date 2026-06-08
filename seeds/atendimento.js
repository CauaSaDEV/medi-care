const { Atendimento } = require('../model')
const sequelize = require('../config/database')

const seedAtendimento = async () => {
    try {
        await sequelize.sync({ force: false })

        const atendimento = [
            {
                consultaId: 2,
                medicoId: 2,
                anamnese: 'Paciente retorna com melhora dos sintomas após tratamento inicial.',
                diagnostico: 'Gripe viral',
                prescricao: 'Paracetamol 500mg 8/8h',
                observacoes: 'Paciente orientado a manter hidratação e repouso.',
                exames_solicitados: null,
                retorno_dias: 7,
                data_atendimento: new Date('2025-10-25 10:30:00'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]

        for (const dados of atendimento) {
            // findOrCreate evita duplicar se rodar o seed duas vezes
            await Atendimento.findOrCreate({
                where: { consultaId: dados.consultaId },
                defaults: dados
            })
        }

        console.log('Seeds de atendimentos criadas com sucesso!')
        process.exit(0)

    } catch (err) {
        console.error('Erro ao criar seeds de atendimentos:', err.message)
        process.exit(1)
    }
}

seedAtendimento()
