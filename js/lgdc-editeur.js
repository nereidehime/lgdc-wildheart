/* Éditeur de messages : boutons de SCEditor en icônes Phosphor, boutons inutiles retirés.
   Adapté de « Better Text Editor » (Kim, Blank Theme : https://blankthemerpg.forumactif.com/t77-edison). */
(function () {
  'use strict';
  if (!document.getElementById('textarea_content')) return;

  // commande SCEditor (data-sceditor-command) : icône Phosphor
  var ICONS = {
    bold: 'ph-text-b', italic: 'ph-text-italic', underline: 'ph-text-underline', strike: 'ph-text-strikethrough',
    left: 'ph-text-align-left', center: 'ph-text-align-center', right: 'ph-text-align-right', justify: 'ph-text-align-justify',
    bulletlist: 'ph-list-bullets', orderedlist: 'ph-list-numbers', horizontalrule: 'ph-minus',
    quote: 'ph-quotes', code: 'ph-code', faspoiler: 'ph-eye-closed', fahide: 'ph-lock-simple',
    image: 'ph-image', link: 'ph-link-simple',
    size: 'ph-text-aa', color: 'ph-palette', font: 'ph-text-t',
    mention: 'ph-at', emoticon: 'ph-smiley', source: 'ph-brackets-angle'
  };
  var REMOVE = ['table', 'servimg', 'youtube', 'headers', 'date', 'time', 'pastetext', 'removeformat', 'more', 'embed', 'twemojifa'];

  function dress() {
    var buttons = document.querySelectorAll('.sceditor-button:not([data-lgdc])');
    buttons.forEach(function (button) {
      var command = button.getAttribute('data-sceditor-command');
      button.setAttribute('data-lgdc', '');
      if (REMOVE.indexOf(command) >= 0) { button.remove(); return; }
      if (!ICONS[command]) return;
      button.innerHTML = '<i class="ph-light ' + ICONS[command] + '" aria-hidden="true"></i>';
      button.classList.add('lgdc-editor-icon');
    });
    return buttons.length;
  }

  // SCEditor construit sa barre après le chargement : on attend qu'elle apparaisse
  if (dress()) return;
  var observer = new MutationObserver(function () { if (dress()) observer.disconnect(); });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(function () { observer.disconnect(); }, 15000);
})();
