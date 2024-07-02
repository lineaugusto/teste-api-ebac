/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000') 
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response =>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    }))
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    let usuario = 'Usuario' + Math.floor(Math.random() *1000000000000000)
    let email = Math.floor(Math.random() *1000000000000000)+'beltrano@qa.com.br'
    cy.cadastrarUsuario(usuario,email,'123','true')
    .should((response =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    }))
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url:'usuarios',
      body:{
        "nome": "Fulano da Silva",
        "email": "123",
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).should((response =>{
      expect(response.status).equal(400)
      expect(response.body.email).equal('email deve ser um email válido')
    }))
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    let usuario = 'Usuario Editado' + Math.floor(Math.random() *1000000000000000)
    let email = Math.floor(Math.random() *1000000000000000)+'beltrano@qa.com.br'
    cy.cadastrarUsuario(usuario,email,'123','true')
    .then(response =>{
      let id = response.body._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body:{
          "nome": usuario,
          "email": email,
          "password": "teste",
          "administrador": "true"
        }
      }).should((response =>{
        expect(response.status).equal(200)
        expect(response.body.message).equal('Registro alterado com sucesso')
      }))
    })
  });

  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    let usuario = 'Usuario a ser deletado' + Math.floor(Math.random() *1000000000000000)
    let email = Math.floor(Math.random() *1000000000000000)+'beltrano@qa.com.br'
    cy.cadastrarUsuario(usuario,email,'123','true')
    .then(response => {
      let id = response.body.id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
      }).should((response =>{
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Nenhum registro excluído')
      })) 
    })
  });
});
