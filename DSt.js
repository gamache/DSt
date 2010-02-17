/* DSt: 
   a simple, agnostic DOM Storage library.
   http://github.com/gamache/DSt
    
   AUTHORSHIP
   copyright 2010  pete gamache  gamache!@#$!@#gmail.com
   licensed under the MIT License and/or the GPL version 2

   SYNOPSIS:
   DSt uses the localStorage mechanism to provide per-site, persistent
   storage of JSON-encodable data.

   USAGE:
   DSt.set(key, value);
   var value = DSt.get(key);
   DSt.store(input_elt);      // stores value of a form input element
   DSt.recall(input_elt);     // recalls stored value of a form input element
   DST.populate(form_elt);    // recalls each of a form's input elements
*/

var DSt                   // <-- to change the global namespace, do it here
= (function(){var DSt = { // <-- not here

  version: 0.001002,
  
  get: function (key) {
    var hash = DSt._gethash();
    return hash[key];
  },
  set: function (key, value) {
    var hash = DSt._gethash();
    hash[key] = value;
    DSt._sethash(hash);
    return hash[key];
  },
  _gethash: function () {
    if (localStorage.DSt == ''  ||
        localStorage.DSt == 'null' ||
        localStorage.DSt == 'undefined' ||
        typeof(localStorage.DSt) != 'string' ) {
      localStorage.DSt = '{}';
    }
    return JSON.parse(localStorage.DSt);
  },
  _sethash: function (new_hash) {
    localStorage.DSt = JSON.stringify(new_hash);
    return new_hash;
  },

  store: function (elt) {
    if (typeof(elt) == 'string') {
      elt = document.getElementById(elt);
    }
    var key = '_form_' + elt.form.name + '_field_' + elt.name;

    if (elt.type == 'checkbox') {
      DSt.set(key, elt.checked);
    }
    else {
      DSt.set(key, elt.value);
    }
  },

  recall: function (elt) {
    if (typeof(elt) == 'string') {
      elt = document.getElementById(elt);
    }
    var key = DSt._form_elt_key(elt);
    var stored_value = DSt.get(key);

    if (elt.type == 'checkbox') {
      elt.checked = stored_value==true;
    }
    else {
      elt.value = stored_value || '';
    }
  },

  _form_elt_key: function (form_elt) {
    return  '_form_' + form_elt.form.name + '_field_' + form_elt.name;
  },


  populate: function (form) {
    if (typeof(form) == 'string') {
      form = document.getElementById(form);
    }
    for (var node in form.childNodes) {
      if (node.tagName == 'INPUT') DSt.recall(node);  
    }
  },

  // storage_types() returns a string containing every supported
  // storage mechanism
  storage_types: function () {
    var st = '';
    for (var i in window) {
      if (i=='sessionStorage' || i=='globalStorage' ||
          i=='localStorage'   || i=='openDatabase') {
        st += st ? (' '+i) : i; 
      }
    }
    return st;
  },

  javascript_accepts_trailing_comma: false
};
return DSt;
})();

