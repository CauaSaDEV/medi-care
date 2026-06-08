const Profissional = require('./profissional')
const Paciente = require('./pacientes')
const Atendimento = require('./atendimento')
const Consulta = require('./consulta')

// Paciente tem varias consultas

Paciente.hasMany(Consulta,{
    foreignKey: 'pacienteId',
    as: 'consultas'
});
Consulta.belongsTo(Paciente,{
    foreignKey: 'pacienteId',
    as: 'paciente'
});

// Um Médico pode ter varias consultas

Profissional.hasMany(Consulta, {
    foreignKey: "medicoId",
    as: "consultasMedicas"
});
Consulta.belongsTo(Profissional,{
    foreignKey: "medicoId",
    as: "medico"
});

//!Profissional que agendou consulta, verificar relacionamento.

Profissional.hasMany(Consulta, {
    foreignKey: "agendado_por",
    as: "consultasAgendadas"
});

Consulta.belongsTo(Profissional, {
    foreignKey: "agendado_por",
    as: "agendador"
});

//Atendimento

Consulta.hasOne(Atendimento, {
    foreignKey: "consultaId",
    as: "atendimento"
});
Atendimento.belongsTo(Consulta, {
    foreignKey: "consultaId", 
    as: "consulta"
});

//medico realiza varios atendimentos

Profissional.hasMany(Atendimento, {
    foreignKey: "medicoId",
    as: "atendimentos"
});

Atendimento.belongsTo(Profissional, {
    foreignKey: "medicoId",
    as: "medico"
});

module.exports = {
    Profissional,
    Paciente,
    Consulta,
    Atendimento
};

