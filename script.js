var app = new Vue({
    el: "#app",
    data: {
        isHelp          : false,
        theWinner       : '...',
        clickedPlayer1  : 0,
        clickedPlayer2  : 0,
        gameIsActive    : false,
        gameIsFinish    : false,
        isProcessing    : false,
        scalable        : '',
        n_point         : '',
        loopings        : 0,
        temp_loopings   : 0,
        currentPlayer   : "X",
        gameState       : [],
        widd            : '0%',
        minutes         : '00',
        seconds         : '00',
        hour            : '00',
        timeOut         : null,
        subs            : ''
    },

    methods : {

        exitGame:function(){
            const vm = this
            vm.scalable         = ''
            vm.n_point          = ''
            vm.isProcessing     = false
            vm.gameIsActive     = false
            vm.loopings         = 0
            vm.gameState        = []
            vm.otherFunction()
            vm.temp_loopings    = 0
        },

        otherFunction:function(){
            const vm = this
            vm.theWinner        = '...'
            vm.clickedPlayer1   = 0
            vm.clickedPlayer2   = 0
            vm.gameIsFinish     = false
            vm.currentPlayer    = 'X'
            vm.clear_angka()
        },

        restartGame(){
            const vm        = this
            vm.hour         = '00'
            vm.minutes      = '00'
            vm.seconds      = '00'
            vm.otherFunction()
            vm.runTime()
            for(let i = 0; i < vm.gameState.length; i++){
                for(let j = 0; j < vm.gameState.length; j++){
                    vm.gameState[i][j] = ''
                }
            }
        },

        runTime:function(){
            const vm = this
            let s = parseInt(vm.seconds),
                m = parseInt(vm.minutes),
                h = parseInt(vm.hour)

            s += 1;
            if(s == 60){ s = 0; m += 1; }

            if(m == 60){ m = 0; h += 1; }

            for(let i = 1; i <= 3; i++){
                if(i == 1){ vm.seconds      = vm.convertionNumber(s) }
                else if(i == 2){ vm.minutes = vm.convertionNumber(m) }
                else if(i == 3){ vm.hour    = vm.convertionNumber(h) }
            }

            if(!vm.gameIsFinish ){
                vm.timeOut = setTimeout(() => {
                    clearTimeout(vm.timeOut);
                     vm.runTime()
                }, 1000);
            }
        },

        convertionNumber:function(msg){
            let i = ''
            if(msg == 0){ i = '00' }
            else if(msg == 1){ i = '01' }
            else if(msg == 2){ i = '02' }
            else if(msg == 3){ i = '03' }
            else if(msg == 4){ i = '04' }
            else if(msg == 5){ i = '05' }
            else if(msg == 6){ i = '06' }
            else if(msg == 7){ i = '07' }
            else if(msg == 8){ i = '08' }
            else if(msg == 9){ i = '09' }
            else { i = msg }
            return i
        },

        startGame:function(){
            const vm = this

            if(vm.scalable >= 3){
                if(vm.scalable == 3 || vm.scalable == 4){
                    vm.n_point = 3;
                }
                else if(vm.scalable > 4 && vm.scalable <= 15){
                    vm.n_point = 4;
                }
                else {
                    if(vm.n_point < 5){
                        vm.n_point = 5
                    }
                }
            }
            else {
                if(vm.scalable != '' && vm.n_point != ''){
                    vm.scalable = 3
                    vm.n_point = 3
                }
                else {
                    return;
                }

            }

            vm.isProcessing = true
            vm.widd = (100 / parseInt(vm.scalable))

            setTimeout(function(){

                vm.gameIsActive = true
                vm.runTime()

                vm.clear_angka()

                vm.gameState        = []
                vm.loopings         = parseInt(vm.scalable)
                vm.temp_loopings    = vm.loopings

                for(let i = 0; i < vm.loopings; i++){
                    let temp = []
                    for(let j = 0; j < vm.loopings; j++){
                        temp.push("")
                    }
                    vm.gameState.push(temp)
                }

                vm.isProcessing = false
            }, 1250);

        },

        get_click:function(baris, kolom, event){
            const vm = this

            console.log(event)
            for(let i = 0; i < vm.gameState.length; i++){
                for(let j = 0; j < vm.gameState.length; j++){
                    if(i == baris && j == kolom && vm.gameState[i][j] == ''){
                        vm.gameState[i][j]      = vm.currentPlayer
                        let colors = ''
                        if(vm.currentPlayer == 'X'){
                            vm.clickedPlayer1 += 1
                            colors = '#cc0404';
                        }
                        else {
                            colors = '#0425cc'
                            vm.clickedPlayer2 += 1
                        }
                        event.target.innerHTML  =   '<span class="tengah" style="color: ' + colors +
                                                    '; font-size: ' + vm.widd + 'vh">' + vm.currentPlayer +
                                                    '</span>'
                        vm.currentPlayer        = vm.currentPlayer === "X" ? "O" : "X"

                        vm.check_condition(baris, kolom, vm.gameState[i][j])
                    }
                }
            }
        },

        horizontal_vertical:function(value, position){
            const vm = this
            let i = 0, j = 0, temp, total = 0, result = false
            do {

                while(j < vm.gameState.length){

                    if(position == 'horizontal'){
                        temp = vm.gameState[i][j]
                    }
                    else {
                        temp = vm.gameState[j][i]
                    }

                    if(temp == value){
                        total += 1
                        if(total == vm.n_point){ j += 100 }
                    }
                    else {
                        total = 0
                    }
                    j++
                }

                if(total == vm.n_point){
                    result = true
                    i += 100
                }
                else {
                    total = 0
                    i += 1
                    j  = 0
                }

            }while(i < vm.gameState.length);

            return result
        },

        diagonal_data:function(baris, kolom, value, position){
            const vm = this
            let total = 0, finish = false, result = false
            do {
                if(vm.gameState[baris][kolom] == value){
                    total += 1
                    if(position == 'bawah kiri'){
                        baris += 1
                        kolom -= 1

                        if(baris >= vm.loopings || kolom < 0){
                            finish = true
                        }
                    }
                    else if(position == 'bawah kanan'){
                        baris += 1
                        kolom += 1

                        if(baris >= vm.loopings || kolom >= vm.loopings){
                            finish = true
                        }
                    }
                    else if(position == 'atas kiri'){
                        baris -= 1
                        kolom -= 1

                        if(baris < 0 || kolom < 0){
                            finish = true
                        }
                    }
                    else {
                        baris -= 1
                        kolom += 1

                        if(baris < 0 || kolom >= vm.loopings){
                            finish = true
                        }
                    }
                }
                else {
                    total = 0
                    finish = true
                }

                if(total == vm.n_point){
                    finish = true
                    result = true
                }

            }while(!finish);

            return result
        },

        check_condition:function(baris, kolom, value){
            const vm = this

            let i = 0, result = false
            do {
                if(i == 0){
                    result = vm.horizontal_vertical(value, 'horizontal')
                }
                else if(i == 1){
                    result = vm.horizontal_vertical(value, 'vertical')
                }
                else if(i == 2){
                    result = vm.diagonal_data(baris, kolom, value, 'bawah kiri')
                }
                else if(i == 3){
                    result = vm.diagonal_data(baris, kolom, value, 'bawah kanan')
                }
                else if(i == 4){
                    result = vm.diagonal_data(baris, kolom, value, 'atas kiri')
                }
                else if(i == 5){
                    result = vm.diagonal_data(baris, kolom, value, 'atas kanan')
                }

                if(result){
                    i += 6
                }
                i++;
            }while(i < 6);

            if(result){
                vm.isTheWinner()
                return;
            }

            result = vm.checkDraw()
            if(result){
                vm.isTheDraw()
                return;
            }

        },

        checkDraw:function(){
            const vm = this
            let result = true
            for(let i = 0; i < vm.gameState.length; i++){
                for(let j = 0; j < vm.gameState.length; j++){
                    if(vm.gameState[i][j] == ''){
                        result = false
                    }

                    if(!result){
                        j += vm.gameState.length
                    }
                }
                if(!result){
                    i += vm.gameState.length
                }
            }
            return result
        },

        isTheWinner:function(){
            const vm        = this
            vm.gameIsFinish = true
            vm.subs         = 'Congratulation'
            if(vm.currentPlayer == 'O'){
                vm.theWinner = '(X) as Player 1 (Winner)'
            }
            else {
                vm.theWinner = '(O) as Player 2 (Winner)'
            }
        },

        isTheDraw:function(){
            const vm = this
            vm.gameIsFinish = true
            vm.subs         = 'Failed'
            vm.theWinner    = '(X O) Player 1 & 2 (Draw)'
        },

        clear_angka:function(){
            const vm = this
            for(let i = 0; i < vm.temp_loopings; i++){
                for(let j = 0; j < vm.temp_loopings; j++){
                    let id = 'a' + i + 'b' + j
                        document.getElementById(id).innerHTML = "";
                }
            }
        },

        toggle:function(msg){
            const vm = this
            if(msg == 'open'){
                vm.isHelp = true
            }
            else {
                vm.isHelp = false
            }
        },


    }
})
