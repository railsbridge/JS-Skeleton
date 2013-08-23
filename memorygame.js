memoryGame = (function () {
  'use strict';

  // Settings:

  var TIMEOUT = 1000;
  var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'grey'];

  // Launch function:

  function launchGame () {
    var $wrapperEl = $('#wrapper');

    var game = new Game(COLORS, TIMEOUT);
    game.render($wrapperEl);
  }

  // Game class:

  function Game (colors, timeout) {
    this.timeout = timeout;
    this.score = 0;
    this.lastCard = null;

    this.cards = Game.generateCards(colors);
  }

  Game.generateCards = function (colors) {
    var cards = [];

    colors.forEach(function (color) {
      cards.push(new Card(color));
      cards.push(new Card(color));
    });

    return cards.shuffleInPlace();
  }

  Game.prototype.render = function ($wrapperEl) {
    var self = this;
    $wrapperEl.html('');

    this.cards.forEach(function (card, id) {
      card.render($wrapperEl, id);
      card.bind(self.click.bind(self));
    });
  }

  Game.prototype.click = function (event) {
    var id = $(event.target).attr('id');
    var card = this.cards[id];

    card.show();

    if (this.lastCard !== null) {
      this.match(this.lastCard, card);
      this.lastCard = null;
    } else {
      this.lastCard = card;
    }
  }

  Game.prototype.match = function (card1, card2) {
    this.unbindCards(); // can't select new cards while match is in progress

    if (Card.match(card1, card2)) {
      this.score++;
      this.hideAndBindCards();
    } else {
      setTimeout(this.hideAndBindCards.bind(this), this.timeout);
    }
  }

  Game.prototype.hideAndBindCards = function () {
    var self = this;

    this.cards.forEach(function (card) {
      card.hide();
      card.bind(self.click.bind(self));
    });
  }

  Game.prototype.unbindCards = function () {
    this.cards.forEach(function (card) {
      card.unbind();
    });
  }

  // Card class:

  function Card (color) {
    this.$el = Card.createEl();
    this.color = color;
    this.matched = false;
  }

  Card.createEl = function() {
    var $el = $("<div>");
    $el.addClass("card");

    return $el;
  }

  Card.match = function (card1, card2) {
    if (card1.color === card2.color) {
      card1.matched = true;
      card2.matched = true;
      return true;
    }

    return false;
  }

  Card.prototype.render = function($wrapperEl, id) {
    this.$el.attr('id', id);
    $wrapperEl.append(this.$el);
  }

  Card.prototype.show = function () {
    this.$el.css("background-color", this.color);
    this.$el.css("background-image", "none");
    this.unbind(); // can't select a card that's already visible
  }

  Card.prototype.hide = function () {
    if (this.matched) { return; } // matched cards can't be hidden

    return this.$el.css("background", "");
  }

  Card.prototype.bind = function (callback) {
    if (this.matched) { return; } // matched cards can't be selected

    return this.$el.bind('click', callback);
  }

  Card.prototype.unbind = function () {
    this.$el.unbind('click');
  }

  // Fisher-Yeates shuffle implementation (http://bost.ocks.org/mike/shuffle/)

  Array.prototype.shuffleInPlace = function () {
    var i = this.length, j, swap;

    // While there remain elements to shuffle…
    while (i > 0) {

      // Pick a remaining element…
      j = Math.floor(Math.random() * i--);

      // And swap it with the current element.
      swap = this[i];
      this[i] = this[j];
      this[j] = swap;
    }

    return this;
  }

  return launchGame
}());

$(memoryGame);