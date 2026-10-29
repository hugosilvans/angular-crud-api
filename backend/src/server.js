const { criarApp } = require('./app');
const porta = Number(process.env.PORT || 3000);

// O servidor é separado do app para permitir testes sem iniciar uma porta fixa.
criarApp().listen(porta, () => console.log(`API em http://localhost:${porta}/api/products`));
