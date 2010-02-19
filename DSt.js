/* DSt: 
   a simple, agnostic DOM Storage library.
   http://github.com/gamache/DSt
    
   AUTHORSHIP:
   copyright 2010  pete gamache  gamache!@#$!@#gmail.com
   licensed under the MIT License and/or the GPL version 2

   SYNOPSIS:
   DSt uses the localStorage mechanism to provide per-site, persistent
   storage of JSON-encodable data.

   USAGE:

    DSt.set(key, value);         // sets stored value for given key
    var value = DSt.get(key);    // returns stored value for given key

    DSt.store(input_elt);        // stores value of a form input element
    DSt.recall(input_elt);       // recalls stored value of a form input elt

    DSt.store_form(form_elt);    // runs DSt.store(elt) on each form input
    DSt.populate_form(form_elt); // runs DSt.recall(elt) on each form input

    Element IDs may always be given in place of the elements themselves.
*/


var DSt                   // <-- to change the global namespace, do it here
= (function(){var DSt = { // <-- not here

  version: 0.002001,
  

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
    if(typeof(localStorage.DSt) != 'string' ) {
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
    var key = DSt._form_elt_key(elt);

    if (elt.type == 'checkbox') {
      DSt.set(key, elt.checked);
    }
    else if (elt.type == 'radio') {
      if (elt.checked) DSt.set(key, elt.value);
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
    else if (elt.type == 'radio') {
      if (elt.value == stored_value) elt.checked = true;
    }
    else {
      elt.value = stored_value || '';
    }
  },

  _form_elt_key: function (form_elt) {
    return  '_form_' + form_elt.form.name + '_field_' + form_elt.name;
  },



  recall_form: function (form) {
    return DSt._apply_fn_to_form_inputs(form, DSt.recall);
  },

  store_form: function (form) {
    return DSt._apply_fn_to_form_inputs(form, DSt.store);
  },

  _apply_fn_to_form_inputs: function (form, fn) {
    if (typeof(form)=='string') form=document.getElementById(form);
    for (var i in form.childNodes) {
      var node = form.childNodes[i];
      if (node.tagName == 'INPUT' || node.tagName == 'TEXTAREA') {
        fn(node);
      }
    }
  },
  


  // _storage_types() returns a string containing every supported
  // storage mechanism
  _storage_types: function () {
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

