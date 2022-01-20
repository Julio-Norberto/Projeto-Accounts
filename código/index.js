// Modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// Modulos internos
const fs = require('fs')
const { encode } = require('punycode')

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
        ],
    },
    ]).then((answer) => {
        const action = answer['action']

        if (action === 'Criar conta') {
            createaccount()
        } else if (action === 'Consultar Saldo') {
            getAccountBalance()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Sacar') {
            withdraw()
        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }
    }).catch((err) => console.log(err))
}

// Exibindo mensagem de criação de conta

function createaccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildaccount()
}


// Criando e salvando as informações da conta
function buildaccount() {
    inquirer.prompt([
    {
        name: 'accountname',
        message: 'Digite o nome da sua conta',
    },
    ]).then((answer) => {
        const accountname = answer['accountname']
        console.info(answer['accountname'])

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

//Depositando valores na conta
function deposit() {
    inquirer.prompt([
        {
            name: 'accountname',
            message: 'Informe o nome da conta',
        },
    ])
    .then((answer) => {
        const accountname = answer['accountname']

        if (!checkAccount(accountname)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Insira o valor a ser depositado',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            // adicionando saldo
            addAmount(accountname, amount)
            operation()
        }).catch((err) => console.log(err))
    })
}

//checando se a conta existe
function checkAccount(accountname) {
    if (!fs.existsSync(`accounts/${accountname}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, Tente novamente'))
        return false
    }
    return true
}

//adicionando saldo a conta
function addAmount(accountname, amount) {
    const accountData = getAccount(accountname)

    if(!amount) {
        console.log(chalk.bgRed.black('Por favor insira um valor e tente novamente!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountname}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi adicionado o valor de R$${amount} na sua conta`))
}

//função auxiliar para coletar o arquivo JSON
function getAccount(accountname) {
    const accountJSON = fs.readFileSync(`accounts/${accountname}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//consultando saldo existente na conta
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountname',
            message: 'Informe o nome da sua conta',
        },
    ]).then((answer) => {
        const accountname = answer['accountname']

        //verificando a existência da conta
        if(!checkAccount(accountname)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountname)
        console.log(chalk.bgBlue.black(`O valor disponível na sua conta é de R$${accountData.balance}`))
        operation()

    }).catch((err) => console.log(err))
}

//sacando dinheiro da conta do usuário
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountname',
            message: 'Qual o nome da sua conta?',
        },
    ]).then((answer) => {
        const accountname = answer['accountname']

        if(!checkAccount(accountname)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Informe o valor que você quer sacar'
            },
        ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountname, amount)
            


        }).catch((err) => console.log(err))


    }).catch((err) => console.log(err))
}

function removeAmount(accountname, amount) {
    const accountData = getAccount(accountname)

    if(!amount) {
        console.log(chalk.bgRed.black('Por favor insira um valor e tente novamente'))
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountname}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$ ${amount} da sua conta`))
    operation()
}
