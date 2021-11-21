/**
 * Created by Sasha on 23.02.2017.
 */
"use strict";
var app = angular.module('verbs', ['ui.router']);
var nameJSFile = '200.json';

////////////////////////////////////////////////////////////////////////////////////////////

app.run(function ($http, wordList, $rootScope, settings, speak) {
    var model = {};
    $http.get(nameJSFile).then(function (response) {
        model.items = response.data;
        ;
        //дальше блок кода не связаный с запросом        
        var temp = JSON.parse(localStorage.getItem(nameJSFile));
        if (temp == null) {
            for (var t = 0; t < model.items.length; t++) {
                model.items[t].rate = 0;
            }
        } else {
            for (var t = 0; (t < temp.length) && (t < model.items.length); t++) {
                if (temp[t].n === model.items[t].verb) {
                    model.items[t].rate = temp[t].r;
                    model.items[t].like = temp[t].l;
                }
            }
        }
        //тут дополнительная проверка
        for (var t = 0; t < model.items.length; t++) {
            model.items[t].ind = t;
            if (model.items[t].rate === undefined) {
                model.items[t].rate = 0;
                model.items[t].like = true;
            }
            //console.log(model.items[t]);
        }
        // wordList.items = model.items.slice(0, model.items.length);
        wordList.items = model.items;
        $rootScope.$broadcast('ok');
        speak.speak("");
    }, function (data, status, headers, config) {
    });
}
);

app.service('wordList', function () {
    this.items = [];
    this.sum = 0;
    this.number = 0;
    this.write = function () {
        var temp = [];
        for (var t = 0; t < this.items.length; t++) {
            var obj = {};
            obj.n = this.items[t].verb;
            obj.r = this.items[t].rate;
            obj.l = this.items[t].like;
            temp.push(obj);
        }
        localStorage.setItem(nameJSFile, JSON.stringify(temp));
        // console.log("wr");
    };
    this.delObj = function (thing) {
        // console.log(this.obj);
    };
});
//----------------------------------------------------------------------------------------
app.service('settings', function () {
    this.num1 = 3;
    this.num2 = 3;
    this.num3 = 3;
    this.lessons = 8;
    this.voice = "Microsoft Anna - English (United States)";
    function get(th) {
        var obj = JSON.parse(localStorage.getItem("settings"));

        if (obj != null) {
            th.num1 = obj.num1;
            th.num2 = obj.num2;
            th.num3 = obj.num3;
            th.lessons = obj.lessons;
            th.voice = obj.voice;
        }
    }

    get(this);

    this.save = function () {
        localStorage.setItem("settings", JSON.stringify(this));
    }
});
///////////////////////////////////
app.service('speak', function (settings) {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.voiceNum = 0;

    this.speak = function (str) {


        if (str !== '') {
            var arr = str.split("");
            for (var i = 0; i < arr.length; i++) {
                
                if ((arr[i] === "*") || (arr[i] === "+"))
                {
                    arr.splice(i, 1);
                }
            }
            str = arr.join("");
           



            var utterThis = new SpeechSynthesisUtterance(str);
            if (this.voices !== undefined) {
                utterThis.voice = this.voices[this.voiceNum];
            }
            utterThis.pitch = 1;
            utterThis.rate = 1;
            this.synth.speak(utterThis);
        } else {
            this.voices = window.speechSynthesis.getVoices();
            //console.log(this.voices.length);
            for (var i = 0; i < this.voices.length; i++) {
                if (this.voices[i].name === settings.voice) {
                    this.voiceNum = i;
                    //console.log(this.voices[i].name);
                }
            }
        }
    }


});



//----------------------------------------------------------------------------------------
app.service('manager', function (settings, wordList, $rootScope) {

    this.massive = [];
    this.counter = -1;

    this.putIn = function (array) {
        var arr = [0, 1, 2, 3];

        function compareRandom(a, b) {
            return Math.random() - 0.5;
        }

        arr.sort(compareRandom);

        for (var i = 0; i < 4; i++) {
            switch (arr[i]) {
                case 0:
                    array.push(this.massive[this.counter].right)
                    break;
                case 1:
                    array.push(this.massive[this.counter].wrong1)
                    break;
                case 2:
                    array.push(this.massive[this.counter].wrong2)
                    break;
                case 3:
                    array.push(this.massive[this.counter].wrong3)
                    break;
            }
        }



    }

    this.create = function () {
        this.massive = [];
        function compareNumeric(a, b) {
            if (a.rate > b.rate)
                return 1;
            if (a.rate < b.rate)
                return -1;
        }

        // var arr = wordList.items.slice(0, wordList.items.length);
        var arr = [];
        for (var i = 0; i < wordList.items.length; i++) {
            if (wordList.items[i].like === true) {
                arr.push(wordList.items[i]);
            }
        }

        arr.sort(compareNumeric);
        //console.log(arr);
        for (var r = 0; (r < settings.lessons) && (r < arr.length); r++) {
            var obj = {
                task: null,
                right: null,
                wrong1: null,
                wrong2: null,
                wrong3: null,
                ind: null
            };
///потом продумать если последние слова
            if (arr[r].ind < wordList.items.length / 2) {
                if (arr[r].rate < settings.num1) {
                    obj.right = arr[r].verb;
                    obj.task = arr[r].meaning;
                    obj.wrong1 = wordList.items[arr[r].ind + 1].verb;
                    obj.wrong2 = wordList.items[arr[r].ind + 2].verb;
                    obj.wrong3 = wordList.items[arr[r].ind + 3].verb;
                    obj.ind = arr[r].ind;
                } else {
                    obj.right = arr[r].meaning;
                    obj.task = arr[r].verb;
                    obj.wrong1 = wordList.items[arr[r].ind + 1].meaning;
                    obj.wrong2 = wordList.items[arr[r].ind + 2].meaning;
                    obj.wrong3 = wordList.items[arr[r].ind + 3].meaning;
                    obj.ind = arr[r].ind;
                }
            } else {
                if (arr[r].rate < settings.num1) {
                    obj.right = arr[r].verb;
                    obj.task = arr[r].meaning;
                    obj.wrong1 = wordList.items[arr[r].ind - 1].verb;
                    obj.wrong2 = wordList.items[arr[r].ind - 2].verb;
                    obj.wrong3 = wordList.items[arr[r].ind - 3].verb;
                    obj.ind = arr[r].ind;
                } else {
                    obj.right = arr[r].meaning;
                    obj.task = arr[r].verb;
                    obj.wrong1 = wordList.items[arr[r].ind - 1].meaning;
                    obj.wrong2 = wordList.items[arr[r].ind - 2].meaning;
                    obj.wrong3 = wordList.items[arr[r].ind - 3].meaning;
                    obj.ind = arr[r].ind;
                }
            }
            this.massive.push(obj);

        }
        // console.log(this.massive);
    }

});

app.directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs, model) {
            $timeout(function () {
                element[0].focus();
            });
        }
    };
});




