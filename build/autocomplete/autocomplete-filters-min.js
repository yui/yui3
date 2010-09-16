YUI.add("autocomplete-filters",function(D){var C=D.Array,E=D.Object,A=D.Unicode.WordBreak,B=D.mix(D.namespace("AutoCompleteFilters"),{charMatch:function(I,H,F){var G=C.unique((F?I:I.toLowerCase()).split(""));return C.filter(H,function(J){if(!F){J=J.toLowerCase();}return C.every(G,function(K){return J.indexOf(K)!==-1;});});},charMatchCase:function(G,F){return B.charMatch(G,F,true);},phraseMatch:function(H,G,F){if(!F){H=H.toLowerCase();}return C.filter(G,function(I){return(F?I:I.toLowerCase()).indexOf(H)!==-1;});},phraseMatchCase:function(G,F){return B.phraseMatch(G,F,true);},startsWith:function(H,G,F){if(!F){H=H.toLowerCase();}return C.filter(G,function(I){return(F?I:I.toLowerCase()).indexOf(H)===0;});},startsWithCase:function(G,F){return B.startsWith(G,F,true);},wordMatch:function(J,H,F){var G={ignoreCase:!F},I=A.getUniqueWords(J,G);return C.filter(H,function(K){var L=C.hash(A.getUniqueWords(K,G));return C.every(I,function(M){return E.owns(L,M);});});},wordMatchCase:function(G,F){return B.wordMatch(G,F,true);}});},"@VERSION@",{requires:["array-extras","unicode-wordbreak"]});