const Profissional = require('./profissional');
const Paciente = require('./pacientes');
const Atendimento = require('./atendimento');
const Consulta = require('./consulta');

// Paciente tem várias consultas
Paciente.hasMany(Consulta, {
    foreignKey: 'pacienteId',
    as: 'consultas',
    onDelete: 'RESTRICT' // Impede exclusão se houver consulta
});
Consulta.belongsTo(Paciente, {
    foreignKey: 'pacienteId',
    as: 'paciente'
});

// Um Médico pode ter várias consultas
Profissional.hasMany(Consulta, {
    foreignKey: "medicoId",
    as: "consultasMedicas",
    onDelete: 'RESTRICT' // Impede exclusão se houver consulta
});
Consulta.belongsTo(Profissional, {
    foreignKey: "medicoId",
    as: "medicoConsulta"
});

// Profissional que agendou consulta
Profissional.hasMany(Consulta, {
    foreignKey: "agendado_por",
    as: "consultasAgendadas",
    onDelete: 'RESTRICT'
});
Consulta.belongsTo(Profissional, {
    foreignKey: "agendado_por",
    as: "agendador"
});

// Atendimento
Consulta.hasOne(Atendimento, {
    foreignKey: "consultaId",
    as: "atendimento",
    onDelete: 'RESTRICT'
});
Atendimento.belongsTo(Consulta, {
    foreignKey: "consultaId", 
    as: "consulta"
});

module.exports = {
    Atendimento,
    Consulta,
    Paciente,
    Profissional
}