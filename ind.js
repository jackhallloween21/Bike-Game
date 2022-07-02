"use strict";
var W,H,D,g;
var maxGap, maxDH, score;
var midAir,gameOver=true;
var buildings, bike;

//Download stuff...
var bikePic = new Image();
bikePic.src = "https://cdn.onlinewebfonts.com/svg/img_538422.png";

var boom = new Image();
boom.src = "https://www.dropbox.com/s/lzgw4sj6spemel5/39E78FFA-D372-4AF3-A61C-3BB625DAAE9A.png?raw=1";

var bgmusic = new Audio("https://drive.google.com/uc?export=download&id=1qI0F7Oo0EtFiSPARSx-Zj0PluDXY3iti");
bgmusic.loop = true;

var bangsound = new Audio("https://www.fesliyanstudios.com/play-mp3/561");

var wheelsound = new Audio("https://www.fesliyanstudios.com/play-mp3/4719");
wheelsound.loop = true;
//BTW, all sounds from Fesliyan Studios!


const {sin, cos, PI, sqrt, random, floor, ceil, round, abs} = Math;

function id(n){
    return document.getElementById(n);
}
    
/*function atan(x1,y1,x2,y2){
    let dx = x2 - x1;
    let dy = y2 - y1;
    if(dx==0){
        if(dy>=0){
            return PI/2;
        }
        else{
            return (3/2)*PI;
        }
    }
    else if(dx>0){
        return Math.atan(dy/dx);
    }
    else{return PI+Math.atan(dy/dx);}
}*///Don't need this...

window.onload = function(){
    var cnv = document.getElementById("cnv");
    var ctx = cnv.getContext("2d");
    function init(){
        W = window.innerWidth;
        H = window.innerHeight;
        cnv.width = W;
        cnv.height = H;
        D = round((W<H?W:H)/40);
        midAir = true;
        gameOver = false;
        score = 0;
        document.body.style.background = [
            "linear-gradient(skyblue, lightblue)",
            "linear-gradient(#FD5E53, #FFC922)",
            "linear-gradient(#335, grey)",
            "linear-gradient(#335, grey)",
            "linear-gradient(#FD5E53, #FFC922)",
            "linear-gradient(skyblue, lightblue)",
        ][floor(random()*6)];//3 different times of the day supported! 
        
        /*
        Let, D*4 pixels = 1 meter.
        Let, 1 second = 60 frames.
        So, g = 9.8m/s^2 ≈ 10m/s^2 = 10*4*D/3600 px/frame^2.
        Velocity of bike = 11m/s = 11*4*D/60 px/frame.
        */
        g = 40*D/3600;
        bike = {
            vx:44*D/60,
            jv:30*D/60,//Jump velocity.
            vy:0,
            w:D*8,
            h:D*4,
            x:D*4,
            y:H/2 - D*8,
            draw(){
                //console.log("It's working!")
                /*ctx.fillStyle = "red";
                ctx.fillRect(this.x,this.y,this.w,this.h);*/
                this.vy += g;
                midAir = true;
                
                //Collision detection!!!
                for(let b of buildings){
                if(this.x+this.w>=b.x && this.x<b.x && this.y<b.y+b.h && this.y+this.h>b.y){
                if(this.y+this.h-b.y<=D)
                    this.y-=this.y+this.h-b.y;
                
                else
                    gameOver = true;
                
                  }
                }
              if(!gameOver){
                for(let b of buildings){
                if(this.y+this.vy+this.h>=b.y && this.y+this.vy<b.y && this.x<b.x+b.w && this.x+this.w>b.x){
                    this.vy = b.y - this.y - this.h;
                    midAir = false;
                    }
                }
              }//Too many Curly Brackets!
                this.y += this.vy;
                if(!midAir){
                  ctx.drawImage(
                    bikePic,
                    this.x,
                    this.y,
                    this.w,
                    this.h
                  );
                }
                else{
                  ctx.save();
                  ctx.translate(
                    this.x,
                    this.y
                  );
                  ctx.rotate(-Math.atan(1/8));
                  ctx.drawImage(
                    bikePic,
                    0,0,
                    this.w,
                    this.h
                  );
                  ctx.restore();
                }//For that jumping tilt.
            }
            
        }
        
        maxGap = bike.vx*bike.jv/g;//Half the range of projectile.
        //console.log(maxGap/D)
        maxDH = (bike.jv**2)/(2*g);//Maximum height of projectile.
        buildings = [];
        let b = new Building(0,H/2);
        b.w = D*80>W?D*80:W*2;//For screens whose heights are less than half of their widths.
        buildings.push(b);
        window.onresize = function(){
            if(!gameOver){
                init();
            }
        };
        //animate();
        bgmusic.pause();
        if(id("audiobox").checked)
            wheelsound.play();
    }
    id("loader").style.display = "none";
    
    function Building(x,h){
        this.x = x;
        this.h = h;
        this.y = H-this.h;
        this.ww = D*4//Window width
        this.w = this.ww*(ceil(maxGap*2/this.ww));
        this.color = "rgba(0,0,255,0.1)";
        this.draw = function(){
            ctx.fillStyle = "black";
            ctx.fillRect(
                this.x,
                H,
                this.w,
                -this.h
            );
            ctx.fillStyle = this.color;
            ctx.clearRect(
                this.x+D/2,
                H,
                this.w-D,
                -this.h+D/2
            );
            ctx.fillRect(
                this.x+D/2,
                H,
                this.w-D,
                -this.h+D/2
            );
            ctx.fillStyle = "black";
            for(let i=this.x+D/2;i<=this.x+this.w-D/2;i+=this.ww){
                ctx.fillRect(
                    i-D/10,
                    H,
                    D/5,
                    -this.h
                );
            }
            for(let i=H-this.h;i<H;i+=D*8){
                ctx.fillRect(
                    this.x,
                    i,
                    this.w,
                    D/5
                );
            }
            this.x -= bike.vx;
            if(this.x+this.w>=W && this.x+this.w<W+bike.vx){
                buildings.push(
                    new Building(this.x+this.w+(maxGap*random()+maxGap)/2,H/2-maxDH/2+maxDH*random())
               );
            }
        };
    }
    
    function animate(){
        ctx.clearRect(0,0,W,H);
        
        //Score, not distance...
        ctx.fillStyle = 'white';
        ctx.font = "bold "+(D*3)+"px Courier";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score, W*6/7, 20);
        //The bike
        bike.draw();
        //Buildings
        for(let b=0;b<buildings.length;b++){
            buildings[b].draw();
            if(buildings[b].x+buildings[b].w<0){
                buildings.splice(b,1);
                b--;
            }
        }
        //bike.draw();
        
        score++;
        if(score%500==0){
            bike.vx += 8*D/60;//Velocity increases by 2m/s.
            maxGap = bike.vx*bike.jv/g;
        }
        /*if(midAir)
            score++;*///No extra credit for flight.
            
        //Draw speedometer:
        ctx.beginPath();
        ctx.arc(D*7,H-D*7,D*7,PI*5/6,PI/6);
        ctx.fillStyle = "silver";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(D*7,H-D*7,D*6,PI*5/6,PI/6);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = "bold "+(D*2)+"px Courier";
        ctx.beginPath();
        ctx.fillText(
            `${((bike.vx*60/(4*D))*(36/10)+random()).toFixed(1)}kmph`,
             D*7, H-D*7
        );//Convert px/frame to m/s to km/h, add random() for dramatic effect 😒...
        if(!gameOver)
       window.requestAnimationFrame(animate)
       else{
           //The explosion.
           ctx.drawImage(
               boom,
               bike.x+bike.w/2-D*6,
               bike.y-D*6,
               D*16,
               D*12,
           );
           bangsound.currentTime = 0.5;
           if(id("audiobox").checked){
            try{
               bangsound.play();
            }catch(err){}
           }
                
           wheelsound.pause();
           wheelsound.currentTime = 0;
           id("retry").style.display = "block";
       }
    }
    //animate();
    
    //Eventlisteners...
    id("start").addEventListener("click", function(){
        id("startscreen").style.display = "none";
        init();
        animate();
    })
    
    id("audiobox").addEventListener("input",function(){
        if(this.checked){
            id("label1").textContent = "Audio: On";
            id("label2").textContent = "🔊";
            bgmusic.currentTime = 3;
            wheelsound.currentTime = 0;
            gameOver?bgmusic.play():wheelsound.play();
        }
        else{
            id("label1").textContent = "Audio: Off";
            id("label2").textContent = "🔇";
            bgmusic.pause();
            wheelsound.pause()
        }
    });
    
    cnv.ontouchstart = function(){
        if(!gameOver &&! midAir){
            bike.vy = -bike.jv;
        }
    }
    window.onkeypress = function(e){
        if(!gameOver && !midAir){
            let x = e.charCode || e.keyCode;
            if(x==32);
            bike.vy = -bike.jv;
        }
    }//Finally, keyboard support!
    
    id("retry").onclick = function(){
        this.style.display = "none";
              id("startscreen").style.display = "flex";
                if(id("audiobox").checked){
              bgmusic.currentTime=4;
              bgmusic.play();
            }
    }
   
}//All this for a simple click and jump
