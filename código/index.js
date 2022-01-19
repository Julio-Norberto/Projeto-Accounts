// Modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// Modulos internos
const fs = require('fs')

// Exibindo as opções do usuário e coletando sua escolha
operation ()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ]
    },
    ]).then((answer) => {
        const action = answer['action']
        if (action === 'Criar conta') {
            createaccount()
        }
    }).catch((err) => console.log(err))
}

// Exibindo mensagem de criação de conta

function createaccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildaccount()
}

function buildaccount() {
    inquirer.prompt([
    {
        name: 'accountname',
        message: 'Digite o nome da sua conta',
    },
    ]).then((answer) => {
        const accountname = answer['accountname']
        console.info(accountname)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountname}.json`)) {
            console.log(chalk.bgRed.black('Essa conta já existe!'))
            buildaccount()
            return
        }

        fs.writeFileSync(`accounts/${accountname}.json`, '{"balance": 0}', 
            function (err) {
            console.log(err)
            },
        )
        
        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()
    }).catch((err) => console.log(err))
}