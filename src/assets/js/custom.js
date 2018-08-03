// Preloader //
$(window).on('load', function () {
  function slotMachineify(_expression) {
    var _words = _expression[0],
      _wordsDiv = [],
      _letters = [' ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
      _current = 0,
      _nbrLetters = 15,
      _init = null;

    (function () {
      initHey();
      initStock();
      createWordsDiv();
      createWordsSpan();
      placeLetters();
      wordsRoll();
    })();

    function initHey() {
      _init = setInterval(function () {
        _current++;
        if (_current >= _expression.length) {
          _current = 0;
        }
        _words = _expression[_current];
        wordsRoll();
      }, 1000);
    }

    function initStock() {
      var _lgth = 0;
      for (var j = 0; j < _expression.length; j++) {
        for (var i = 0; i < _expression[j].length; i++) {
          if (_expression[j][i].length > _lgth) {
            var _lgth = _expression[j][i].length;
            _nbrLetters = _expression[j][i].length;
          }
        }
      }
    }

    function createWordsDiv() {
      for (var i = 0; i < _words.length; i++) {
        var myElem = document.getElementById('letras');
        if (myElem != null) {
          myElem.innerHTML += '<div id="word"></div>';
          _wordsDiv.push('#word');
        }

      }
    }

    function createWordsSpan() {
      for (var i = 0; i < _wordsDiv.length; i++) {
        for (var k = 0; k < _nbrLetters; k++) {
          document.getElementById('word').innerHTML += '<span class="word-span"></span>';
        }
      }
    }

    function placeLetters() {
      var str;
      for (var k = 0; k < _wordsDiv.length; k++) {
        for (var i = 0; i < document.getElementsByClassName('word-span').length; i++) {
          document.getElementsByClassName('word-span')[i].style.top = '0';
          for (var n = 0; n < _letters[0].length; n++) {
            document.getElementsByClassName('word-span')[i].style.top = '0';
            if (_letters[0].charAt(n) !== ' ') {
              str = '<p id=' + _letters[0].charAt(n) + '>' + _letters[0].charAt(n) + '</p>';
            } else {
              str = '<p>' + _letters[0].charAt(n) + '</p>';
            }
            document.getElementsByClassName('word-span')[i].innerHTML += str;
          }
        }
      }
    }

    function wordsRoll() {
      for (var k = 0; k < _wordsDiv.length; k++) {
        for (var i = 0; i < _nbrLetters; i++) {
          if (_words[k] !== undefined) {
            if (_words[k].split('')[i] !== ' ' && _words[k].split('')[i] !== undefined) {
              document.getElementsByClassName('word-span')[i].style.top = document.getElementById(_words[k].split('')[i]).offsetTop * -1 + 'px';
            } else {
              document.getElementsByClassName('word-span')[i].style.top = '0';
            }
          }
        }
      }
    }
  }

  // TODO: Move to external YML file
  var words = [
    ['EARN'],
    ['EASY'],
    ['RICH'],
    ['COOL'],
    ['DEAL'],
    ['GAIN'],
    ['GOAL'],
    ['USER'],
    ['PLAN'],
    ['IDEA'],
    ['SAFE'],
    ['MAKE'],
    ['SELL'],
    ['HIGH'],
    ['SHOP'],
    ['MEET'],
    ['MAIN'],
    ['MOTO'],
    ['BEST'],
    ['FIND']
  ];

  slotMachineify(words);


});
