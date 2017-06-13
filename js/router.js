/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'html/home.html',
                controller: function ($scope, manager, wordList) {

                }
            })
            .state('optipns', {
                url: '/options',
                templateUrl: 'html/options.html',
                controller: function ($scope, settings, speak) {
                    $scope.num1 = settings.num1;
                    $scope.num2 = settings.num2;
                    $scope.num3 = settings.num3;
                    $scope.lessons = settings.lessons;
                    $scope.voices = speak.voices;
                    $scope.voice = settings.voice;

                    $scope.save = function () {
                        settings.num1 = $scope.num1;
                        settings.num2 = $scope.num2;
                        settings.num3 = $scope.num3;
                        settings.lessons = $scope.lessons;
                        settings.voice = $scope.voice;
                        settings.save();
                        speak.speak("");
                    }
                }
            })
            .state("list", {
                url: '/list',
                templateUrl: 'html/list.html',
                controller: function ($scope, wordList, $rootScope, manager) {
                    $scope.list = wordList;

                    $scope.set = function (item) {
                        item.like = !item.like;
                    }
                    $rootScope.$on('ok', function (event, data) {
                        $scope.list = wordList;
                        manager.create();
                        // console.log("fr1");
                    });
                }
            })

            .state("trial", {
                url: '/trial',
                templateUrl: 'html/trial.html',
                controller: function ($scope, manager, settings, $state, wordList, $timeout, speak) {
                    $scope.task = null;
                    $scope.answers = [];
                    $scope.wallpaper = "tra";
                    $scope.result = true;
                    $scope.typing = false;
                    manager.counter++;

                    if (manager.counter === 0) {
                        manager.create();
                        //console.log("n");

                    }
                    if (manager.counter >= manager.massive.length) {
                        $scope.result = false;
                        wordList.write();
                        manager.counter = -1;

                    }
                    $scope.counter = manager.counter + 1 + "/" + manager.massive.length;
                    if (manager.counter >= 0) {
                        $scope.task = manager.massive[manager.counter].task;
                        manager.putIn($scope.answers);
                        //console.log(wordList.items[manager.massive[manager.counter].ind].rate);

                        if (wordList.items[manager.massive[manager.counter].ind].rate > settings.num2 + settings.num1) {
                            $scope.typing = true;
                            $scope.answers[0] = manager.massive[manager.counter].right;
                            $scope.answers[1] = "";
                            console.log($scope.task);

                        }
                    }


                    $scope.checkLetter = function (e) {

                        $scope.wallpaper = "tra";
                        if ($scope.answers[1].length > $scope.task.length) {
                            $scope.wallpaper = "red";
                            //console.log("length");
                            return;
                        }
                        if ($scope.answers[1] !== $scope.task.substring(0, $scope.answers[1].length)) {
                            $scope.wallpaper = "red";
                            //console.log("red");
                            return;
                        }

                        if ($scope.answers[1] === $scope.task) {
                            wordList.items[manager.massive[manager.counter].ind].rate++;
                            var promiseObj = $timeout(function () {
                                return $state.go($state.current, {}, {reload: true});
                                ;
                            }, 500);
                            speak.speak($scope.task);
                            $scope.wallpaper = "green";
                        }

                        if ($scope.task.charAt($scope.answers[1].length + 1) === "*") {
                            $scope.answers[1] = $scope.answers[1] + " *";
                        }
                        if ($scope.task.charAt($scope.answers[1].length + 1) === "+") {
                            $scope.answers[1] = $scope.answers[1] + " +";
                        }

                    }


                    $scope.check = function (str) {
                        if (str === manager.massive[manager.counter].right) {
                            wordList.items[manager.massive[manager.counter].ind].rate++;
                            speak.speak(   wordList.items[manager.massive[manager.counter].ind].verb);
                            var promiseObj = $timeout(function () {
                                return $state.go($state.current, {}, {reload: true});
                                ;
                            }, 1000);
                            $scope.wallpaper = "green";
                        } else {
                            $scope.wallpaper = "red";
                            for (var i = 0; i < wordList.items.length; i++) {
                                if (manager.massive[manager.counter].right === wordList.items[i].verb) {
                                    var promiseObj = $timeout(function () {
                                        return $state.go("verb", {"ind": i, "back": 'trial'});
                                    }, 200);

                                    return;
                                }
                                if (manager.massive[manager.counter].task === wordList.items[i].verb) {
                                    var promiseObj = $timeout(function () {
                                        return $state.go("verb", {"ind": i, "back": 'trial'});
                                    }, 50);

                                    return;
                                }


                            }
                        }
                    }
                }})

            .state("verb", {
                url: '/verb/:ind/:back',
                templateUrl: 'html/verb.html',
                controller: function ($scope, $stateParams, wordList, speak) {
                    $scope.elect = $stateParams.ind;

                    $scope.back = $stateParams.back;

                    $scope.list = wordList;
                    $scope.verb = $scope.list.items[$scope.elect].verb;
                    $scope.meaning = $scope.list.items[$scope.elect].meaning;
                    $scope.examples = $scope.list.items[$scope.elect].examples;
                    speak.speak($scope.verb = $scope.list.items[$scope.elect].verb);



                    $scope.show = function () {
                        $scope.verb = $scope.list.items[$scope.elect].verb;
                        $scope.meaning = $scope.list.items[$scope.elect].meaning;
                        $scope.examples = $scope.list.items[$scope.elect].examples;

                        /////////////////////////////////////////////////////////////////
                        var temp = [];
                        for (var t = 0; t < $scope.list.items.length; t++) {
                            var obj = {};
                            obj.n = $scope.list.items[t].verb;
                            obj.r = t;
                            temp.push(obj);
                        }
                        localStorage.setItem(nameJSFile, JSON.stringify(temp));
                        ////////////////////////////////////////////////////////////////
                    }

                }

            })

});