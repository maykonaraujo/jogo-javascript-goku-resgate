function start(){
    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2' ></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    
    
    var jogo = {};
    var velocidade = 5;
    var velocidade2 = 3;
    var posicaoY = parseInt(Math.random()*334);
    var podeAtirar = true;
    var fimdejogo=false;
    var pontos = 0;
    var salvos=0;
    var perdidos=0;
    var energiaAtual = 3;
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somResgate = document.getElementById("somResgate");
    var somPerdido = document.getElementById("somPerdido");
    var somGameOver = document.getElementById("somGameover");
    var tecla = {
        W: 87,
        S: 83,
        D: 68,
        up: 38,
        down:40,
        Enter: 13
    };
    jogo.pressionou = [];
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    jogo.timer = setInterval(loop,30);
    function loop(){
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }
    function movefundo(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-1);
    }
    function movejogador(){
        if(jogo.pressionou[tecla.W] || jogo.pressionou[tecla.up]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);
            if(topo<=10){
                $("#jogador").css("top",topo+10);
            }
        }
        if(jogo.pressionou[tecla.S] || jogo.pressionou[tecla.down]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);
            if(topo>=434){
                $("#jogador").css("top",topo-10);
            }
        }
        if(jogo.pressionou[tecla.D] || jogo.pressionou[tecla.Enter]){
            disparo();
            
        }
        
    }
    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);
        
        if(posicaoX <=0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
    }
    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-velocidade);
        
        if(posicaoX<=0){
            $("#inimigo2").css("left",775);
        }
    }
    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
        if(posicaoX>906){
            $("#amigo").css("left",0);
        }
    }
    function disparo(){
        if(podeAtirar){
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            
            var tempoDisparo = window.setInterval(executarDisparo,30);
        }
        function executarDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+15);
            
            if(posicaoX >900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
                
            }
        }
    }
    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        if(colisao1.length>0){
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            
            posicaoY = parseInt(Math.random()*334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
        if(colisao2.length>0){
            
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            $("#inimigo2").remove();
            reposicionaInimigo2();
        }
        if(colisao3.length>0){
            velocidade+=0.3;
            pontos+=2;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
            
            posicaoY = parseInt(Math.random()*334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
        if(colisao4.length>0){
            velocidade2+=0.1;
            pontos+=1;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            reposicionaInimigo2();
        }
        if(colisao5.length>0){
            pontos+=1;
            salvos++;
            somResgate.play();
            $("#amigo").remove();
            reposicionaAmigo();
            
        }
        if(colisao6.length>0){
            pontos-=1;
            perdidos++;
            somPerdido.play();
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }
    }
    function explosao1(inimigo1X,inimigo1Y){
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image","url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top",inimigo1Y);
        div.css("left",inimigo1X);
        div.animate({width:200,opacity:0},"slow");
        var tempoExplosao = window.setInterval(removeExplosao,1000);
        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }
    function explosao2(inimigo2X,inimigo2Y){
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image","url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top",inimigo2Y);
        div2.css("left",inimigo2X);
        div2.animate({width:200,opacity:0},"slow");
        var tempoExlosao2 = window.setInterval(removeExplosao2,1000);
        function removeExplosao2(){
            div2.remove();
            window.clearInterval(tempoExlosao2);
            tempoExlosao2 = null;
        }
    }
    function explosao3(amigoX,amigoY){
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3,1000);
        function resetaExplosao3(){
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
        
    }
    function reposicionaInimigo2(){
        var tempoColisao4 = window.setInterval(reposiciona4,5000);
            function reposiciona4(){
                window.clearInterval(tempoColisao4);
                tempoColisao4 = null;
                if(fimdejogo==false){
                    $("#fundoGame").append("<div id='inimigo2'></div>");
                }
            }
    }
    function reposicionaAmigo(){
        var tempoAmigo = window.setInterval(reposiciona6,6000);
        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if(fimdejogo==false){
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }
    function placar(){
        $("#placar").html("<h2> Pontos: "+pontos+"<br /> Salvos: "+ salvos + "<br /> Perdidos: "+ perdidos+"</h2>");
    }
    function energia(){
       if(energiaAtual===0){
            $("#energia").css("background-image","url(imgs/energia"+0+".png");
            gameOver();
       }else{
            $("#energia").css("background-image","url(imgs/energia"+energiaAtual+".png");

       } 
    }
    function gameOver(){
        fimdejogo = true;
        somGameOver.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#inimigo3").remove();
        $("#amigo").remove();
        $("#placar").remove();
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1> Fim de Jogo <h1><p> <b>"+pontos+"</b> Pontos </p>"+"<button id='reinicia' onClick='reiniciaJogo()'>Jogar Novamente\n\
    </h3></button>");
    }
    
}
function reiniciaJogo(){
    $("#fim").remove();
    var somGameOver = document.getElementById("somGameover");
    somGameOver.pause();
    start();
}