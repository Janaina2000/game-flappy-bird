function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div' , 'corpo')

    this.elemento.appendChild(reversa ? corpo : borda )
    this.elemento.appendChild(reversa ? borda : corpo )

    this.setAltura = altura => corpo.style.height = `${altura}px`;
}

 //const b = new Barreita(true)
 //b.setAltura(200)
 //document.querySelector('[wm-flappy]').appendChild(b.elemento)

 function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
 }

 function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura), 
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if(par.getX() < -par.getLargura()){
           
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouMeio == true){
                notificarPonto()
            } 
        })
    }
 }

 function Passaro (alturaJogo){
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 6 : -3)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if(novoY <= 0){
            this.setY(0)
        }else if (novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
 }

function Progresso() {
    this.elemento = novoElemento('span','progresso')
    this.atualizaPontos = pontos => {
        this.elemento.innerHTML = pontos
        console.log(pontos)
    }
    this.atualizaPontos(0)
 }

/*const barr = new Barreiras(700, 1200, 200, 400)
 const passaro = new Passaro(700)
 const areDoJogo = document.querySelector('[wm-flappy]')
 areDoJogo.appendChild(passaro.elemento)
 areDoJogo.appendChild(new Progresso().elemento)
 barr.pares.forEach(par => areDoJogo.appendChild(par.elemento))
 setInterval(() => {
    barr.animar()
    passaro.animar()
 }, 20)*/

 function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    return horizontal && vertical
 }

 function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
 
    return colidiu
 }

 function FlappyBird(){
    let pontos = 0

    const areDoJogo = document.querySelector('[wm-flappy]');
    const altura = areDoJogo.clientHeight
    const largura = areDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 600, () => progresso.atualizaPontos(++pontos))
    const passaro = new Passaro(altura)

    areDoJogo.appendChild(progresso.elemento)
    areDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areDoJogo.appendChild(par.elemento))

    this.start = () =>{
        const temporizador = setInterval(() => { 
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro, barreiras)){
        
                clearInterval(temporizador)
                alert('Game Hover!! \n sua pontuação foi de '+ pontos + 'pontos');
                document.location.reload(true);
            }
        }, 20)
    }
 }

 new FlappyBird().start()
